import crc16ccitt from "crc/crc16xmodem";

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

  /** Frame without CRC and EOF */
  private get partialFrame(): string {
    // make sure all values are specific number bits

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
}
