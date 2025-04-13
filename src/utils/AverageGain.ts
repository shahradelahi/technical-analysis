import { Indicator, IndicatorInput } from '@/indicator';
import { AverageLossOutput } from '@/utils/AverageLoss';

export interface AverageGainInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type AverageGainOutput = number | undefined;

export type AverageGainTick = number;

export class AverageGain extends Indicator {
  values: number[];
  period: number;

  protected override result: AverageLossOutput[] = [];
  protected override generator;

  constructor(input: AverageGainInput) {
    super(input);
    this.values = input.values;
    this.period = input.period;

    this.generator = this.avgGainGenerator();
    this.generator.next();

    this.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *avgGainGenerator(): IterableIterator<AverageGainOutput, never, AverageGainTick> {
    let currentValue = yield;
    let previousValue = currentValue;

    let periodCounter = 1;
    let totalGain = 0;
    let averageGain: number | undefined;

    currentValue = yield;

    while (true) {
      const priceDifference = currentValue - previousValue;
      const currentGain = Math.max(priceDifference, 0);

      totalGain += currentGain;

      if (periodCounter < this.period) {
        periodCounter++;
      } else {
        averageGain = !averageGain
          ? totalGain / this.period // First average calculation
          : (averageGain * (this.period - 1) + currentGain) / this.period; // Subsequent calculations
      }

      previousValue = currentValue;
      currentValue = yield averageGain;
    }
  }
}
