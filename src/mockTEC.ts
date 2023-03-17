import { spawn } from "child_process";
import { SerialPort } from "serialport";
import { mockFrames } from "./mockFrames";

/** Emulates a TEC device on a serial port.
 * @param path Path to serial port
 * @returns SerialPort instance
 */
export const mockTECServer = async (path: string) => {
  const server = new SerialPort({ path: path, baudRate: 9600 });

  server.on("data", (buffer: Buffer) => {
    const data = buffer.toString().replace(/\r/, "");
    const responseFrame = mockFrames.find((frame) => frame.OUT === data);

    if (!responseFrame) {
      console.log(`No response for ${data}`);
      return;
    }

    server.write(responseFrame.IN + "\r");
  });

  return server;
};

/**
 * Spawns two socat processes and returns the paths to the PTYs.
 * the ptys are setup such that they can talk to each other.
 */
export const spawnSocatDevices = () => {
  return new Promise<{ port1: string; port2: string }>((resolve, reject) => {
    const socat = spawn("socat", ["-d", "-d", "pty,raw,echo=0", "pty,raw,echo=0"]);
    socat.stderr.on("data", (output: Buffer) => {
      const data = output.toString();

      // get "N PTY is (.+)" with regex
      const regex = /N PTY is (.+)/g;
      const match = data.matchAll(regex);

      const [match1, match2] = match;
      const [port1, port2] = [match1[1], match2[1]];

      resolve({ port1, port2 });
    });
  });
};
