import { isNumber } from '@/utils/number';

import { LinkedList } from './LinkedList';

export class FixedSizeLinkedList extends LinkedList {
  public totalPushed: number = 0;
  public periodHigh: number = 0;
  public periodLow: number = Infinity;
  public periodSum: number = 0;
  public lastShift: number = NaN;

  constructor(
    public size: number,
    public maintainHigh?: boolean,
    public maintainLow?: boolean,
    public maintainSum?: boolean
  ) {
    super();
    if (!isNumber(size)) {
      throw new TypeError(`Size required and should be a number. Got ${typeof size}`);
    }
  }

  override push(data: number) {
    this.add(data);
    this.totalPushed++;
  }

  add(data: number) {
    // Handle list at capacity
    if (this.length === this.size) {
      this.#handleListAtCapacity(data);
    } else {
      super.push(data);
    }

    this.#updatePeriodMetrics(data);
  }

  #handleListAtCapacity(data: number) {
    this.lastShift = this.shift();
    super.push(data);
    this.#updateMetricsAfterShift();
  }

  #updateMetricsAfterShift() {
    if (this.maintainHigh && this.lastShift === this.periodHigh) {
      this.calculatePeriodHigh();
    }

    if (this.maintainLow && this.lastShift === this.periodLow) {
      this.calculatePeriodLow();
    }

    if (this.maintainSum) {
      this.periodSum -= this.lastShift;
    }
  }

  #updatePeriodMetrics(data: number): void {
    if (this.maintainHigh && data >= this.periodHigh) {
      this.periodHigh = data;
    }

    if (this.maintainLow && this.periodLow >= data) {
      this.periodLow = data;
    }

    if (this.maintainSum) {
      this.periodSum += data;
    }
  }

  *iterator() {
    this.resetCursor();
    while (this.next()) {
      yield this.current;
    }
  }

  [Symbol.iterator]() {
    this.resetCursor();
    return {
      next: () => {
        const value = this.next();
        return {
          done: !isNumber(value),
          value,
        };
      },
    };
  }

  calculatePeriodHigh(): void {
    this.resetCursor();
    let high = -Infinity;
    for (const item of this) {
      high = Math.max(high, item);
    }
    this.periodHigh = high;
  }

  calculatePeriodLow(): void {
    this.resetCursor();
    let low = Infinity;
    for (const item of this) {
      low = Math.min(low, item);
    }
    this.periodLow = low;
  }
}
