import debug from "debug";
import { ReadlineParser, SerialPort } from "serialport";
import { MeComFrame, MeComResponse } from "./MeComFrame";
import CallbackStore from "./utils/CallbackStore";
import { Float } from "./utils/float";

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

  constructor(port: SerialPort) {
    this.serialPort = port;
    this.registerListener();
  }

  /** @param path Path to serial port */
  public static async open(path: string) {
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

    this.incrementSequenceCounter();
    const query = new MeComFrame("#", 0, this.sequenceCounter, payloadParts);
    const response = await this.sendFrame(query);

    if (responseType == "float32") {
      return new Float32Array(new Uint32Array([parseInt(response.payload[0] as string, 16)]).buffer)[0];
    } else {
      return parseInt(response.payload[0] as string, 16);
    }
  }

  public async setParameter(parameter: number, value: string | number | Float, parameterInstance = 1): Promise<string | number> {
    const parameterHex = parameter.toString(16).padStart(4, "0");
    const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");

    const payload = ["VS", parameterHex, parameterInstanceHex, value];

    this.incrementSequenceCounter();
    const query = new MeComFrame("#", 0, this.sequenceCounter, payload);
    const response = await this.sendFrame(query);

    const responsePayload = response.payload[0];

    if (responsePayload instanceof Float) {
      // This will never happen, (the Float class is only used internally for indicating floats when building a frame)
      // MecomFrame.parse ( which is used by sendFrame ) will always return a string or number
      // But typescript doesn't know that, so we have to throw an error here for narrowing type
      throw new Error("Unexpected error: Response payload is a float");
    }

    return responsePayload;
  }

  public async reset() {
    this.incrementSequenceCounter();
    const query = new MeComFrame("#", 0, this.sequenceCounter, ["RS"]);
    const response = await this.sendFrame(query);
  }

  private incrementSequenceCounter = () => (this.sequenceCounter += 1);

  public async sendFrame(frame: MeComFrame): Promise<MeComResponse> {
    this.serialPort.flush();
    this.serialPort.write(frame.build());

    try {
      const response = await this.waitForResponse(frame);
      log(`Sequence ${frame.sequence}: ${frame.build()} => ${response.build()}`);
      return response;
    } catch (e) {
      log(`Sequence ${frame.sequence}: ${frame.build()} => Error: ${e}`);
      throw e;
    }
  }

  /**
   * Waits for a response with the same sequence number as the given frame
   * this registers a callback for the sequence which is called once the response is received ( in registerListener )
   */
  async waitForResponse(frame: MeComFrame): Promise<MeComResponse> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        return reject(new Error("Timeout"));
      }, this.RESPONSE_TIMEOUT);

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

    const parser = this.serialPort.pipe(new ReadlineParser({ delimiter: "\r", includeDelimiter: true }));
    parser.on("data", onData);
  }
}

export class MeerstetterTEC extends MeComDevice {
  public static async open(path: string) {
    const mecom = await MeComDevice.open(path);
    return new MeerstetterTEC(mecom.serialPort);
  }

  setTemperature(temperature: number) {
    return this.setParameter(3000, new Float(temperature));
  }

  getTemperature() {
    return this.getParameter(3000);
  }

  setOutputEnabled(enabled: boolean) {
    return this.setParameter(2010, enabled ? 1 : 0);
  }
}
