import { SerialPort } from "serialport";
import { mockFrames } from "./mockFrames";
import path from "path";
import { MeComFrame } from "./mecom";

/** Emulates a TEC device on a serial port.
 * @param path Path to serial port
 * @returns SerialPort instance
 */
export const mockTECServer = async (path: string) => {
  const server = new SerialPort({ path: path, baudRate: 9600 });

  server.on("data", (buffer: Buffer) => {
    const data = buffer.toString().replace(/\r/, "");
    const mockResponse = mockFrames.find((frame) => frame.OUT === data);

    let responseFrame = "";

    if (!mockResponse) {
      const parsedFrame = MeComFrame.parse(data + "\r");

      if (parsedFrame.payload == "?VR03E801") {
        // get temperature parameter
        const temperature = Math.random() * 10.0;
        // convert to hex float32 using dataview
        let buffer = new ArrayBuffer(4);
        let view = new DataView(buffer);
        view.setFloat32(0, temperature, false);
        const temperatureHexFloat32 = Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        console.log("sending temperature", temperature);

        responseFrame = new MeComFrame("!", parsedFrame.address, parsedFrame.sequence, `${temperatureHexFloat32}`).build();
      } else if (parsedFrame.payload == "?VR006801") {
        // Get device status
        const status = Math.floor(Math.random() * 6);
        const statusHexInt32 = status.toString(16).padStart(8, "0");

        responseFrame = new MeComFrame("!", parsedFrame.address, parsedFrame.sequence, `${statusHexInt32}`).build();
      } else if (parsedFrame.payload == "?VR080301") {
        // Get device address
        const address = Math.floor(Math.random() * 100);
        const addressHexInt32 = address.toString(16).padStart(8, "0");

        responseFrame = new MeComFrame("!", parsedFrame.address, parsedFrame.sequence, `${addressHexInt32}`).build();
      } else {
        console.log("Couldn't figure out what to do with this one");
        console.log(parsedFrame);

        // ACK response??
        responseFrame = new MeComFrame("!", parsedFrame.address, parsedFrame.sequence, "").build();
      }
    } else {
      responseFrame = mockResponse.IN + "\r";
    }

    console.log(`got: ${data}`, `sending: ${responseFrame}`);
    server.write(responseFrame);
  });

  console.log(`Started mock TEC server on ${path}`);
  return server;
};

if (require.main === module) {
  // get port from command line
  const port = process.argv[2];
  if (!port) {
    console.log(`Please specify a port, e.g: ts-node ${path.basename(__filename)} /dev/ttyUSB0`);
    process.exit(1);
  }

  mockTECServer(port);
}