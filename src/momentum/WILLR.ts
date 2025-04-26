import { Indicator, IndicatorInput } from '@/indicator';
import { RollingWindow } from '@/utils/RollingWindow';

export interface WILLRInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];

  /**
   * It's period.
   * @default 14
   */
  period?: number;
}

export type WILLROutput = number | undefined;

export interface WILLRTick {
  high: number;
  low: number;
  close: number;
}

/**
 * ### William's Percent R (WILLR)
 *
 * William's Percent R is a momentum oscillator similar to the Stochastic Oscillator.
 * It attempts to identify overbought and oversold conditions.
 *
 * **Calculation**:
 *
 * ```
 * WILLR = 100 * ((close - LL) / (HH - LL) - 1)
 * ```
 *
 * Where:
 * - `LL` is the lowest low for the look-back period.
 * - `HH` is the highest high for the look-back period.
 *
 * **Sources**:
 *
 * - https://www.tradingview.com/wiki/Williams_%25R_(%25R)
 */
export class WILLR extends Indicator<WILLROutput, WILLRTick> {
  period: number;

  protected override result: WILLROutput[] = [];
  protected override generator;

  constructor(input: WILLRInput) {
    super(input);

    this.period = input.period || 14;

    this.generator = this.willrGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *willrGenerator(): IterableIterator<WILLROutput, never, WILLRTick> {
    const highWindow = new RollingWindow(this.period);
    const lowWindow = new RollingWindow(this.period);

    let tick = yield;
    let output;

    while (true) {
      highWindow.push(tick.high);
      lowWindow.push(tick.low);

      if (highWindow.filled()) {
        const lowestLow = lowWindow.lowest();
        const highestHigh = highWindow.highest();

        output = 100 * ((tick.close - lowestLow) / (highestHigh - lowestLow) - 1);
      }

      tick = yield output;
    }
  }

  static calculate(input: WILLRInput): WILLROutput[] {
    return new WILLR(input).getResult();
  }
}
