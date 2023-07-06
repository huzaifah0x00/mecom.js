import { Float } from "./float";

export function convertNumberToHex(number: number | Float) {
  if (number instanceof Float) {
    return convertToFloat32Hex(number.value);
  } else {
    return number.toString(16).padStart(8, "0");
  }
}

function convertToFloat32Hex(part: number) {
  let buffer = new ArrayBuffer(4);
  let view = new DataView(buffer);
  view.setFloat32(0, part, false);
  const hex = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex;
}
