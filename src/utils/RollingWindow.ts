export class RollingWindow extends Array<number> {
  private readonly windowSize: number;

  constructor(windowSize: number, ...items: number[]) {
    super(...items);
    this.windowSize = windowSize;
  }

  override push(value: number): number {
    super.push(value);
    if (this.length > this.windowSize) {
      this.shift();
    }
    return this.length;
  }

  override unshift(value: number): number {
    super.unshift(value);
    if (this.length > this.windowSize) {
      this.pop();
    }
    return this.length;
  }

  filled(): boolean {
    return this.length === this.windowSize;
  }

  sum(): number {
    return this.values().reduce((a, b) => a + b, 0);
  }

  avg(): number {
    return this.sum() / this.length;
  }

  highest(): number {
    return Math.max(...this.values());
  }

  lowest(): number {
    return Math.min(...this.values());
  }
}
