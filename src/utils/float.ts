export class Float {
  public readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
