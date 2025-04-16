import { Indicator, IndicatorInput } from '@/indicator';

export interface MOMInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type MOMOutput = number | undefined;

export type MOMTick = number;

/**
 * ### Momentum (MOM)
 *
 * The Momentum indicator (MOM) is a technical analysis tool used to measure the speed or strength of a security's price movement.
 * It essentially reflects the change in price over a specific period.
 *
 * **Calculation:**
 * The Momentum is calculated by subtracting the closing price of a security `n` periods ago from the current closing price.
 *
 * **Resources:**
 * - [Online Trading Concepts - Momentum](http://www.onlinetradingconcepts.com/TechnicalAnalysis/Momentum.html)
 */
export class MOM extends Indicator<MOMOutput, MOMTick> {
  period: number;

  protected override result: MOMOutput[] = [];
  protected override generator;

  constructor(input: MOMInput) {
    super(input);

    this.period = input.period || 14;

    this.generator = this.momGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *momGenerator(): IterableIterator<MOMOutput, never, MOMTick> {
    let index = 1;
    let tick = yield;

    const windowSize = this.period + 1;
    let window = [tick];
    let output;

    while (true) {
      if (index <= this.period) {
        index++;
        tick = yield;
      } else {
        // Calculate momentum
        output = window[window.length - 1]! - window[0]!;
        tick = yield output;
      }

      // Update window
      window.push(tick);
      window = window.slice(-windowSize);
    }
  }
}
