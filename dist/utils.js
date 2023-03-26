import { spawn } from "child_process";
import { SerialPort } from "serialport";
import { MeComDevice } from ".";
export async function detectMeComPort() {
    const ports = await SerialPort.list();
    for (const port of ports) {
        try {
            const mecom = await MeComDevice.open(port.path);
            await mecom.getDeviceStatus();
            return port.path;
        }
        catch (e) {
            continue;
        }
    }
}
/**
 * Spawns two socat processes and returns the paths to the PTYs.
 * the ptys are setup such that they can talk to each other.
 */
export const spawnSocatDevices = () => {
    return new Promise((resolve, reject) => {
        const socat = spawn("socat", ["-d", "-d", "pty,raw,echo=0", "pty,raw,echo=0"]);
        socat.stderr.once("data", (output) => {
            const data = output.toString();
            // get "N PTY is (.+)" with regex
            const regex = /N PTY is (.+)/g;
            const match = data.matchAll(regex);
            const [match1, match2] = match;
            const [port1, port2] = [match1[1], match2[1]];
            resolve({ port1, port2, close: () => socat.kill() });
        });
    });
};
