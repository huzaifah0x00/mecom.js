import { MeComDevice, MeComFrame } from ".";
import { mockFrames } from "./mockFrames";
import { mockTECServer } from "./mockTEC";
import { spawnSocatDevices } from "./utils";
describe("MeComFrame", () => {
    it("should be able to build frame with correct CRC", () => {
        // #0015AA?IF62AE
        const frame = new MeComFrame("#", 0, 0x15aa, "?IF");
        expect(frame.build()).toEqual("#0015AA?IF62AE\r");
        // #0015AB?VR0064018000
        const frame2 = new MeComFrame("#", 0, 0x15ab, "?VR006401");
        expect(frame2.build()).toEqual("#0015AB?VR0064018000\r");
        // #0015AC?VR0066018125
        const frame3 = new MeComFrame("#", 0, 0x15ac, "?VR006601");
        expect(frame3.build()).toEqual("#0015AC?VR0066018125\r");
        // #0015AEVS07DA01000000028F97
        const frame4 = new MeComFrame("#", 0, 0x15ae, "VS07DA0100000002");
        expect(frame4.build()).toEqual("#0015AEVS07DA01000000028F97\r");
        // #0015AB?VR03E801C21A
        const frame5 = new MeComFrame("#", 0, 0x15ab, "?VR03E801");
        expect(frame5.build()).toEqual("#0015AB?VR03E801C21A\r");
        // #0015B0VS0BB80141AE0000C482
        const frame6 = new MeComFrame("#", 0, 0x15b0, "VS0BB80141AE0000");
        expect(frame6.build()).toEqual("#0015B0VS0BB80141AE0000C482\r");
        // #0015AC?VR04D2017BFE
        const frame7 = new MeComFrame("#", 0, 0x15ac, "?VR04D201");
        expect(frame7.build()).toEqual("#0015AC?VR04D2017BFE\r");
    });
    it("should be able to parse frame", () => {
        const frame = MeComFrame.parse("#0015AB?VR0064018000\r");
        expect(frame.control).toEqual("#");
        expect(frame.address).toEqual(0);
        expect(frame.sequence).toEqual(0x15ab);
        expect(frame.payload).toEqual("?VR006401");
        expect(frame.crc).toEqual(0x8000);
        expect(frame.build()).toEqual("#0015AB?VR0064018000\r");
        expect(() => {
            for (const mockFrame of mockFrames) {
                MeComFrame.parse(mockFrame.IN + "\r");
                MeComFrame.parse(mockFrame.OUT + "\r");
            }
        }).not.toThrow();
    });
});
describe("sendFrame", () => {
    it("should be able to send frame to device", async () => {
        const { port1, port2, close } = await spawnSocatDevices();
        await mockTECServer(port1);
        const tec = await MeComDevice.open(port2);
        const frame = new MeComFrame("#", 1, 0x15ab, "?VR006401");
        const response = await tec.sendFrame(frame);
        expect(response.control).toEqual("!");
        expect(response.address).toEqual(1);
        expect(response.sequence).toEqual(0x15ab);
        expect(response.payload).toEqual("00000462");
        close();
    });
});