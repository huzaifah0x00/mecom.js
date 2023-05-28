export function convertNumberToHex(number: number) {
  if (Number.isInteger(number)) {
    return number.toString(16).padStart(8, "0");
  } else {
    return convertToFloat32Hex(number);
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
