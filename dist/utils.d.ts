export declare function detectMeComPort(): Promise<string | undefined>;
/**
 * Spawns two socat processes and returns the paths to the PTYs.
 * the ptys are setup such that they can talk to each other.
 */
export declare const spawnSocatDevices: () => Promise<{
    port1: string;
    port2: string;
    close: () => void;
}>;
export declare function convertNumberToHex(number: number): string;
