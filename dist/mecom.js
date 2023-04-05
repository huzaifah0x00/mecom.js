import crc16ccitt from "crc/crc16xmodem";
import { SerialPort } from "serialport";
import { convertNumberToHex } from "./utils";
export class MeComFrame {
    control;
    address;
    sequence;
    payload;
    // Frame structure:
    // 1 Control  |  ASCII char | 8 Bits
    // 2 Address  |  UINT8      | 16 Bits
    // 3 Sequence |  Nr. UINT16 | 32 Bits
    // 4 Payload  |  N * 8 Bits | N * 8 Bits
    // 5 Frame    |  CRC UINT16 | 32 Bits
    // 6 EOF      |  ASCII char | 8 Bits
    EOF = "\r";
    constructor(control = "#", address = 0, sequence = 0, payload) {
        this.control = control;
        this.address = address;
        this.sequence = sequence;
        this.payload = payload;
    }
    get crc() {
        return crc16ccitt(Buffer.from(this.partialFrame));
    }
    buildPayloadString() {
        let payload = "";
        for (const part of this.payload) {
            if (typeof part == "string")
                payload += part;
            else if (typeof part == "number")
                payload += convertNumberToHex(part);
            else
                throw new Error(`Unknown payload type: ${typeof part}`);
        }
        return payload;
    }
    /** get Frame without CRC and EOF */
    get partialFrame() {
        const address = this.address.toString(16).padStart(2, "0");
        const sequence = this.sequence.toString(16).padStart(4, "0");
        let frame = "";
        frame += this.control;
        frame += address;
        frame += sequence;
        frame += this.buildPayloadString();
        return frame.toUpperCase();
    }
    build() {
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
    static parse(frame) {
        // Step 1: Separate the fields
        const control = frame[0];
        const address = parseInt(frame.slice(1, 3), 16);
        const sequence = parseInt(frame.slice(3, 7), 16);
        const payload = frame.slice(7, -5);
        const crc = parseInt(frame.slice(-5, -1), 16);
        const parsedFrame = new MeComFrame(control, address, sequence, [payload]);
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
    serialPort;
    RESPONSE_TIMEOUT = 200;
    sequenceCounter = 1;
    constructor(port) {
        this.serialPort = port;
    }
    /** @param path Path to serial port */
    static async open(path) {
        const serialPort = await new Promise((resolve, reject) => {
            const port = new SerialPort({ path, baudRate: 9600 }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(port);
            });
        });
        const mecom = new MeComDevice(serialPort);
        return mecom;
    }
    async getDeviceAddress() {
        return await this.getParameter(2051, undefined, "int32");
    }
    async getDeviceStatus() {
        return await this.getParameter(104, undefined, "int32");
    }
    async getParameter(parameter, parameterInstance = 1, responseType = "float32") {
        const parameterHex = parameter.toString(16).padStart(4, "0");
        const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");
        const payloadParts = ["?VR", parameterHex, parameterInstanceHex];
        const query = new MeComFrame("#", 0, this.sequenceCounter, payloadParts);
        const response = await this.sendFrame(query);
        this.incrementSequenceCounter();
        if (responseType == "float32") {
            console.log(`converting this to float32: ${response.payload[0]}`);
            return new Float32Array(new Uint32Array([parseInt(response.payload[0], 16)]).buffer)[0];
        }
        else {
            return parseInt(response.payload[0], 16);
        }
    }
    async setParameter(parameter, value, parameterInstance = 1) {
        const parameterHex = parameter.toString(16).padStart(4, "0");
        const parameterInstanceHex = parameterInstance.toString(16).padStart(2, "0");
        const payload = ["VS", parameterHex, parameterInstanceHex, value];
        const query = new MeComFrame("#", 0, this.sequenceCounter, payload);
        const response = await this.sendFrame(query);
        this.incrementSequenceCounter();
        return response.payload[0];
    }
    async reset() {
        const query = new MeComFrame("#", 0, this.sequenceCounter, ["RS"]);
        const response = await this.sendFrame(query);
        this.incrementSequenceCounter();
    }
    incrementSequenceCounter = () => (this.sequenceCounter += 1);
    sendFrame(frame) {
        return new Promise((resolve, reject) => {
            const responseHandler = (buffer) => {
                this.serialPort.off("data", responseHandler);
                const resposne = buffer.toString();
                const responseFrame = MeComResponse.parse(resposne);
                if (responseFrame.sequence != frame.sequence) {
                    throw new Error(`Invalid sequence in response, expected sequence: ${this.sequenceCounter}, got: ${responseFrame.sequence}`);
                }
                resolve(responseFrame);
            };
            // TODO: not sure if it's better to have just one dataHandler listening always for all frames
            // or this is fine, where we start listening for the response only when sending a frame
            this.serialPort.on("data", responseHandler);
            this.serialPort.write(frame.build());
            setTimeout(() => reject(new Error("Timeout")), this.RESPONSE_TIMEOUT);
        });
    }
}
