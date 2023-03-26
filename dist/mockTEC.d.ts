import { SerialPort } from "serialport";
/** Emulates a TEC device on a serial port.
 * @param path Path to serial port
 * @returns SerialPort instance
 */
export declare const mockTECServer: (path: string) => Promise<SerialPort<import("@serialport/bindings-cpp").AutoDetectTypes>>;
