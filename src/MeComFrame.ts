import crc16ccitt from "crc/crc16xmodem";
import { convertNumberToHex } from "./utils/convert";

export class MeComFrame {
  // Frame structure:
  // 1 Control  |  ASCII char | 8 Bits
  // 2 Address  |  UINT8      | 16 Bits
  // 3 Sequence |  Nr. UINT16 | 32 Bits
  // 4 Payload  |  N * 8 Bits | N * 8 Bits
  // 5 Frame    |  CRC UINT16 | 32 Bits
  // 6 EOF      |  ASCII char | 8 Bits
  private EOF = "\r";

  constructor(public control = "#", public address: number = 0, public sequence: number = 0, public payload: (string | number)[]) {}

  public get crc(): number {
    return crc16ccitt(Buffer.from(this.partialFrame));
  }

  private buildPayloadString(): string {
    let payload = "";

    for (const part of this.payload) {
      if (typeof part == "string") payload += part;
      else if (typeof part == "number") payload += convertNumberToHex(part);
      else throw new Error(`Unknown payload type: ${typeof part}`);
    }

    return payload;
  }

  /** get Frame without CRC and EOF */
  private get partialFrame(): string {
    const address = this.address.toString(16).padStart(2, "0");
    const sequence = this.sequence.toString(16).padStart(4, "0");

    let frame = "";

    frame += this.control;
    frame += address;
    frame += sequence;
    frame += this.buildPayloadString();

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
    frame += this.buildPayloadString();
    frame += crc;
    frame += this.EOF;

    return frame.toUpperCase();
  }

  public static parse(frame: string): MeComFrame {
    const control = frame[0];
    const address = parseInt(frame.slice(1, 3), 16);
    const sequence = parseInt(frame.slice(3, 7), 16);
    const payload = frame.slice(7, -5);
    const crc = parseInt(frame.slice(-5, -1), 16);

    if (frame.length === 12 && !payload[0] && control === "!") {
      return new ACKFrame("!", address, sequence, []);
    }

    const parsedFrame = new MeComFrame(control, address, sequence, [payload]);

    if (parsedFrame.crc !== crc) {
      throw new Error(`CRC mismatch: ${parsedFrame.crc} !== ${crc}`);
    }

    return parsedFrame;
  }
}

// TODO: make these subclasses more useful
export class MeComResponse extends MeComFrame {
  control = "!";
}

export class ACKFrame extends MeComResponse {
  payload = [""];
}
