import { Indicator, IndicatorInput } from '@/indicator';

export interface AverageChangeInput extends IndicatorInput {
  values: number[];
  period: number;
  /**
   * true for average gain, false for average loss
   */
  positive: boolean;
}

export type AverageChangeOutput = number | undefined;
export type AverageChangeTick = number;

export class AverageChange extends Indicator {
  values: number[];
  period: number;
  positive: boolean;

  protected override result: AverageChangeOutput[] = [];
  protected override generator;

  constructor(input: AverageChangeInput) {
    super(input);
    this.values = input.values;
    this.period = input.period;
    this.positive = input.positive;

    this.generator = this.avgChangeGenerator();
    this.generator.next();

    this.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *avgChangeGenerator(): IterableIterator<AverageChangeOutput, never, AverageChangeTick> {
    // Initialize with the first value
    let currentValue = yield;
    let previousValue = currentValue;

    let periodCounter = 1;
    let totalChange = 0;
    let averageChange: number | undefined;

    // Get next value to kick-off the calculation
    currentValue = yield;

    while (true) {
      // Use the positive flag to determine direction:
      // For gain: current - previous; For loss: previous - current.
      const diff = this.positive ? currentValue - previousValue : previousValue - currentValue;
      const currentChange = Math.max(diff, 0);

      totalChange += currentChange;

      if (periodCounter < this.period) {
        periodCounter++;
      } else {
        averageChange = averageChange === undefined
           ? totalChange / this.period // First average calculation
           : (averageChange * (this.period - 1) + currentChange) / this.period; // Subsequent calculations
      }

      previousValue = currentValue;
      currentValue = yield averageChange;
    }
  }
}
