import { CircularBuffer } from '@se-oss/circular-buffer';

export class RollingWindow {
  private readonly buffer: CircularBuffer;
  private readonly windowSize: number;

  #sum: number = 0;

  [Symbol.iterator](): IterableIterator<number> {
    return this.buffer[Symbol.iterator]();
  }

  constructor(windowSize: number) {
    this.buffer = new CircularBuffer(windowSize);
    this.windowSize = windowSize;
  }

  get length(): number {
    return this.buffer.size();
  }

  at(index: number) {
    return this.buffer.at(index);
  }

  push(value: number) {
    this.#sum += value;
    if (this.length >= this.windowSize) {
      this.#sum -= this.buffer.at(0);
    }

    this.buffer.put(value);
  }

  filled(): boolean {
    return this.buffer.isFull();
  }

  sum(): number {
    return this.#sum;
  }

  avg(): number {
    return this.sum() / this.length;
  }

  highest(): number {
    return Math.max(...this);
  }

  lowest(): number {
    return Math.min(...this);
  }

  values(): number[] {
    return this.buffer.toArray();
  }
}
