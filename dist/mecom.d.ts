import { SerialPort } from "serialport";
export declare class MeComFrame {
    control: string;
    address: number;
    sequence: number;
    payload: (string | number)[];
    private EOF;
    constructor(control: string, address: number, sequence: number, payload: (string | number)[]);
    get crc(): number;
    private buildPayloadString;
    /** get Frame without CRC and EOF */
    private get partialFrame();
    build(): string;
    static parse(frame: string): MeComFrame;
}
export declare class MeComResponse extends MeComFrame {
    control: string;
}
/**
 * use MeComDevice.open() to create a new instance
 * @example
 * const mecom = await MeComDevice.open("/dev/ttyUSB0");
 * const deviceStatus = await mecom.getDeviceStatus();
 */
export declare class MeComDevice {
    readonly serialPort: SerialPort;
    private RESPONSE_TIMEOUT;
    private sequenceCounter;
    private constructor();
    /** @param path Path to serial port */
    static open(path: string): Promise<MeComDevice>;
    getDeviceAddress(): Promise<number>;
    getDeviceStatus(): Promise<number>;
    getParameter(parameter: number, parameterInstance?: number, responseType?: "float32" | "int32"): Promise<number>;
    setParameter(parameter: number, value: string | number, parameterInstance?: number): Promise<string | number>;
    reset(): Promise<void>;
    private incrementSequenceCounter;
    sendFrame(frame: MeComFrame): Promise<MeComResponse>;
}
