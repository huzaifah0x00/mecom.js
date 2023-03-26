import crc16ccitt from "crc/crc16xmodem";
import { SerialPort } from "serialport";

export class MeComFrame {
  // Frame structure:
  // 1 Control  |  ASCII char | 8 Bits
  // 2 Address  |  UINT8      | 16 Bits
  // 3 Sequence |  Nr. UINT16 | 32 Bits
  // 4 Payload  |  N * 8 Bits | N * 8 Bits
  // 5 Frame    |  CRC UINT16 | 32 Bits
  // 6 EOF      |  ASCII char | 8 Bits

  private EOF = "\r";

  constructor(public control = "#", public address: number = 0, public sequence: number = 0, public payload: string) {}

  public get crc(): number {
    return crc16ccitt(Buffer.from(this.partialFrame));
  }

  /** get Frame without CRC and EOF */
  private get partialFrame(): string {
    const address = this.address.toString(16).padStart(2, "0");
    const sequence = this.sequence.toString(16).padStart(4, "0");

    let frame = "";

    frame += this.control;
    frame += address;
    frame += sequence;
    frame += this.payload;

    return frame.toUpperCase();
  }

  public build(): string {
    const address = this.address.toString(16).padStart(2, "0");
    const sequence = this.sequence.toString(16).padStart(4, "0");
    const crc = this.crc.toString(16).padStart(4, "0");

    let frame = "";

    frame += this.control;
    frame += address;
    frame += sequence;
    frame += this.payload;
    frame += crc;
    frame += this.EOF;

    return frame.toUpperCase();
  }

  public static parse(frame: string): MeComFrame {
    // Step 1: Separate the fields

    const control = frame[0];
    const address = parseInt(frame.slice(1, 3), 16);
    const sequence = parseInt(frame.slice(3, 7), 16);
    const payload = frame.slice(7, -5);
    const crc = parseInt(frame.slice(-5, -1), 16);

    const parsedFrame = new MeComFrame(control, address, sequence, payload);

    if (parsedFrame.crc !== crc) {
      throw new Error(`CRC mismatch: ${parsedFrame.crc} !== ${crc}`);
    }

    return parsedFrame;
  }
}

export class MeComResponse extends MeComFrame {
  control = "!";
}

/**
 * use MeComDevice.open() to create a new instance
 * @example
 * const mecom = await MeComDevice.open("/dev/ttyUSB0");
 * const deviceStatus = await mecom.getDeviceStatus();
 */
export class MeComDevice {
  public readonly serialPort!: SerialPort;
  private RESPONSE_TIMEOUT = 200;
  private sequenceCounter = 1;

  private constructor(port: SerialPort) {
    this.serialPort = port;
  }

  /** @param path Path to serial port */
  public static async open(path: string): Promise<MeComDevice> {
    const serialPort = await new Promise<SerialPort>((resolve, reject) => {
      const port = new SerialPort({ path, baudRate: 9600 }, (err) => {
        if (err) reject(err);
        else resolve(port);
      });
    });

    const mecom = new MeComDevice(serialPort);
    return mecom;
  }

  public async getDeviceAddress(): Promise<number> {
    const response = await this.getParameter(2051);
    return parseInt(response);
  }

  public async getDeviceStatus(): Promise<number> {
    const response = await this.getParameter(104);
    return parseInt(response);
  }

  public async getParameter(parameter: number, parameterInstance = 1): Promise<string> {
    const parameterHex = parameter.toString(16).padStart(4, "0");
    const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");

    const query = new MeComFrame("#", 0, this.sequenceCounter, `?VR${parameterHex}${parameterInstanceHex}`);
    const response = await this.sendFrame(query);
    this.incrementSequenceCounter();

    return response.payload;
  }

  public async setParameter(parameter: number, value: string, parameterInstance = 1): Promise<string> {
    const parameterHex = parameter.toString(16).padStart(4, "0");
    const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");

    const query = new MeComFrame("#", 0, this.sequenceCounter, `?VS${parameterHex}${parameterInstanceHex}${value}`);
    const response = await this.sendFrame(query);
    this.incrementSequenceCounter();

    return response.payload;
  }

  public async reset() {
    const query = new MeComFrame("#", 0, this.sequenceCounter, "RS");
    const response = await this.sendFrame(query);

    this.incrementSequenceCounter();
  }

  private incrementSequenceCounter = () => (this.sequenceCounter += 1);

  public sendFrame(frame: MeComFrame): Promise<MeComResponse> {
    return new Promise((resolve, reject) => {
      const dataHandler = (buffer: Buffer) => {
        this.serialPort.off("data", dataHandler);

        const data = buffer.toString();
        const responseFrame = MeComResponse.parse(data);

        if (responseFrame.sequence != this.sequenceCounter) {
          throw new Error("Invalid sequence in response");
        }

        resolve(responseFrame);
      };

      // TODO: not sure if it's better to have just one dataHandler listening always for all frames
      // or this is fine, where we start listening for the response only when sending a frame
      this.serialPort.on("data", dataHandler);
      this.serialPort.write(frame.build());

      setTimeout(() => reject(new Error("Timeout")), this.RESPONSE_TIMEOUT);
    });
  }
}
