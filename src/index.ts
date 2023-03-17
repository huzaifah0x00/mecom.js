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
    const control = frame.charAt(0);
    const address = parseInt(frame.substring(1, 3), 16);
    const sequence = parseInt(frame.substring(3, 7), 16);
    const payload = frame.substring(7, frame.length - 5);
    const crc = parseInt(frame.substring(frame.length - 5, frame.length - 1), 16);

    const parsedFrame = new MeComFrame(control, address, sequence, payload);

    if (parsedFrame.crc !== crc) {
      throw new Error(`CRC mismatch: ${parsedFrame.crc} !== ${crc}`);
    }

    return parsedFrame;
  }
}

export class MeComQuery extends MeComFrame {
  control = "#";
}

export class MeComResponse extends MeComFrame {
  control = "!";
}

export class MeComDevice {
  private serialPort!: SerialPort;
  private RESPONSE_TIMEOUT = 1000;

  /** @param path Path to serial port */
  constructor(public path: string) {
    this.serialPort = new SerialPort({ path: path, baudRate: 9600 });
  }

  public sendFrame = (frame: MeComFrame): Promise<MeComResponse> => {
    return new Promise((resolve, reject) => {
      const dataHandler = (buffer: Buffer) => {
        const data = buffer.toString();
        const responseFrame = MeComResponse.parse(data);
        this.serialPort.off("data", dataHandler);

        resolve(responseFrame);
      };

      // TODO: not sure if it's better to have just one dataHandler for all frames
      this.serialPort.on("data", dataHandler);
      this.serialPort.write(frame.build());

      setTimeout(() => reject(new Error("Timeout")), this.RESPONSE_TIMEOUT);
    });
  };
}
