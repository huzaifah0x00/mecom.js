import debug from "debug";
import { ReadlineParser, SerialPort } from "serialport";
import CallbackStore from "./utils/CallbackStore";
import { MeComFrame, MeComResponse } from "./MeComFrame";

const log = debug("mecom");

/**
 * use MeComDevice.open() to create a new instance
 * @example
 * const mecom = await MeComDevice.open("/dev/ttyUSB0");
 * const deviceStatus = await mecom.getDeviceStatus();
 */
export class MeComDevice {
  public readonly serialPort!: SerialPort;
  private RESPONSE_TIMEOUT = 2000;
  private sequenceCounter = 1;

  private cbStore = new CallbackStore();

  private constructor(port: SerialPort) {
    this.serialPort = port;
    this.registerListener();
  }

  /** @param path Path to serial port */
  public static async open(path: string): Promise<MeComDevice> {
    log(`Opening serial port ${path}`);
    const serialPort = await new Promise<SerialPort>((resolve, reject) => {
      const port = new SerialPort({ path, baudRate: 57600 }, (err) => {
        if (err) reject(err);
        else resolve(port);
      });

      log(`Serial port ${path} opened`);
      port.pipe(new ReadlineParser({ delimiter: "\r" }));
    });

    const mecom = new MeComDevice(serialPort);
    return mecom;
  }

  public async getDeviceAddress(): Promise<number> {
    return await this.getParameter(2051, undefined, "int32");
  }

  public async getDeviceStatus(): Promise<number> {
    return await this.getParameter(104, undefined, "int32");
  }

  public async getParameter(parameter: number, parameterInstance = 1, responseType: "float32" | "int32" = "float32"): Promise<number> {
    const parameterHex = parameter.toString(16).padStart(4, "0");
    const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");

    const payloadParts = ["?VR", parameterHex, parameterInstanceHex];

    const query = new MeComFrame("#", 0, this.sequenceCounter, payloadParts);
    const response = await this.sendFrame(query);
    this.incrementSequenceCounter();

    if (responseType == "float32") {
      return new Float32Array(new Uint32Array([parseInt(response.payload[0] as string, 16)]).buffer)[0];
    } else {
      return parseInt(response.payload[0] as string, 16);
    }
  }

  public async setParameter(parameter: number, value: string | number, parameterInstance = 1): Promise<string | number> {
    const parameterHex = parameter.toString(16).padStart(4, "0");
    const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");

    const payload = ["VS", parameterHex, parameterInstanceHex, value];

    const query = new MeComFrame("#", 0, this.sequenceCounter, payload);
    const response = await this.sendFrame(query);
    this.incrementSequenceCounter();

    return response.payload[0];
  }

  public async reset() {
    const query = new MeComFrame("#", 0, this.sequenceCounter, ["RS"]);
    const response = await this.sendFrame(query);

    this.incrementSequenceCounter();
  }

  private incrementSequenceCounter = () => (this.sequenceCounter += 1);

  public async sendFrame(frame: MeComFrame): Promise<MeComResponse> {
    log(`Sending frame: ${frame.build()}`);

    this.serialPort.flush();
    this.serialPort.write(frame.build());

    log(`Waiting for response`);
    const response = await this.waitForResponse(frame);
    log(`Done waiting for response: ${response}`);

    return response;
  }

  /**
   * Waits for a response with the same sequence number as the given frame
   * this registers a callback for the sequence which is called once the response is received ( in registerListener )
   */
  async waitForResponse(frame: MeComFrame): Promise<MeComResponse> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Timeout")), this.RESPONSE_TIMEOUT);

      const callback = (response: MeComResponse) => {
        clearTimeout(timeout);
        resolve(response);
        this.cbStore.delete(frame.sequence);
      };

      this.cbStore.register(frame.sequence, callback);
    });
  }

  /**
   * Registers a listener for incoming data
   * Once data is received, it is parsed as a frame and the callback for the sequence is called
   */
  private registerListener() {
    const onData = (buffer: Buffer) => {
      const response = buffer.toString();
      log(`(onData): Received data: ${response}`);

      let responseFrame: MeComResponse;
      try {
        responseFrame = MeComResponse.parse(response);
      } catch (e) {
        log(`Error parsing data as a frame, ignoring data... error: ${e}`);
        return;
      }

      const callback = this.cbStore.get(responseFrame.sequence);
      callback?.(responseFrame);
    };

    this.serialPort.on("data", onData);
  }
}
