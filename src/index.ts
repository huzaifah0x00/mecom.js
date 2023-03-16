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
      throw new Error("Invalid CRC");
    }

    return parsedFrame;
  }
}

export class MeComQuery extends MeComFrame {
  control = "#";
}

export const sendFrame = (frame: MeComFrame, port: SerialPort): Promise<MeComFrame> => {
  return new Promise((resolve, reject) => {
    const dataHandler = (buffer: Buffer) => {
      const data = buffer.toString();

      console.log("Server received data:", data);
      const responseFrame = MeComFrame.parse(data);
      console.log("Foudn frame with payload:", responseFrame.payload);

      port.off("data", dataHandler);
      resolve(responseFrame);
    };

    port.on("data", dataHandler);

    console.log("Sending frame:", frame.build());
    port.write(frame.build());
  });
};
