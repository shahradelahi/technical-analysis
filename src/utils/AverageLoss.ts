import { Indicator, IndicatorInput } from '@/indicator';

export interface AverageLossInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type AverageLossOutput = number | undefined;

export type AverageLossTick = number;

export class AverageLoss extends Indicator<AverageLossOutput, AverageLossTick> {
  values: number[];
  period: number;

  protected override result: AverageLossOutput[] = [];
  protected override generator;

  constructor(input: AverageLossInput) {
    super(input);
    this.values = input.values;
    this.period = input.period;

    this.generator = this.avgLossGenerator();
    this.generator.next();

    this.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *avgLossGenerator(): IterableIterator<AverageLossOutput, never, AverageLossTick> {
    // Initialize first value
    let currentValue = yield;
    let previousValue = currentValue;

    // Setup initial state
    let periodCounter = 1;
    let totalLoss = 0;
    let averageLoss: number | undefined;

    // Get next value to start the calculation
    currentValue = yield;

    while (true) {
      // Calculate price difference and loss
      const priceDifference = previousValue - currentValue;
      const currentLoss = Math.max(priceDifference, 0);

      // Update total loss
      totalLoss += currentLoss;

      // Calculate average loss based on period
      if (periodCounter < this.period) {
        // Still collecting initial period data
        periodCounter++;
      } else {
        // Calculate average loss
        averageLoss = !averageLoss
          ? totalLoss / this.period // First average calculation
          : (averageLoss * (this.period - 1) + currentLoss) / this.period; // Subsequent calculations
      }

      // Prepare for next iteration
      previousValue = currentValue;
      currentValue = yield averageLoss;
    }
  }
}
