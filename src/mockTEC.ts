import { spawn } from "child_process";
import { SerialPort } from "serialport";
import { MeComFrame } from ".";

const mockTECDevice = async () => {
  console.log("Server is listening on pty2");
  const { server, client } = await spawnSocatDevices();

  server.on("data", (buffer: Buffer) => {
    const data = buffer.toString();

    console.log("Server received data:", data);
    const requestFrame = MeComFrame.parse(data);
    console.log("Foudn frame with payload:", requestFrame.payload);

    const response = new MeComFrame("!", requestFrame.address, requestFrame.sequence, "");
    console.log("Sending response:", response.build());

    server.write(response.build());
  });

  return client;
};

const spawnSocatDevices = () => {
  return new Promise<{ server: SerialPort; client: SerialPort }>((resolve, reject) => {
    const socat = spawn("socat", ["-d", "-d", "pty,raw,echo=0", "pty,raw,echo=0"]);
    socat.stderr.on("data", (output: Buffer) => {
      const data = output.toString();

      // get "N PTY is (.+)" with regex
      const regex = /N PTY is (.+)/g;
      const match = data.matchAll(regex);

      const [match1, match2] = match;
      const [pty1, pty2] = [match1[1], match2[1]];

      console.log(`got ports:\n  ${pty1}\n  ${pty2}\n`);
      console.log(`Using ${pty2} as server on device, you can use ${pty1} as client`);

      const server = new SerialPort({
        path: pty2,
        baudRate: 9600,
      });

      const client = new SerialPort({
        path: pty1,
        baudRate: 9600,
      });

      resolve({ server, client });
    });
  });
};
