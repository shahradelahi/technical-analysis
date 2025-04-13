import { Indicator, IndicatorInput } from '@/indicator';

export interface TrueRangeInput extends IndicatorInput {
  low: number[];
  high: number[];
  close: number[];
}

export type TrueRangeOutput = number | undefined;

export interface TrueRangeTick {
  low: number;
  high: number;
  close: number;
}

/**
 * True Range
 *
 * A method to expand a classical range (high minus low) to include
 * possible gap scenarios.
 *
 * Sources:
 *     https://www.macroption.com/true-range/
 */
export class TrueRange extends Indicator<TrueRangeOutput, TrueRangeTick> {
  protected override result: TrueRangeOutput[] = [];
  protected override generator;

  constructor(input: TrueRangeInput) {
    super(input);

    this.generator = this.trGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high: high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *trGenerator(): IterableIterator<TrueRangeOutput, never, TrueRangeTick> {
    let tick = yield;
    let lastClose, output;
    while (true) {
      if (lastClose === undefined) {
        lastClose = tick.close;
        tick = yield output;
      }

      const high = Math.abs(tick.high - lastClose);
      const low = Math.abs(tick.low - lastClose);

      output = Math.max(tick.high - tick.low, isNaN(high) ? 0 : high, isNaN(low) ? 0 : low);

      lastClose = tick.close;

      tick = yield output;
    }
  }
}
