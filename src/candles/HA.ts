import { Indicator, IndicatorInput } from '@/indicator';

export interface HAInput extends IndicatorInput {
  low: number[];
  open: number[];
  high: number[];
  close: number[];
}

export type HAOutput =
  | {
      open: number;
      high: number;
      low: number;
      close: number;
    }
  | undefined;

export interface HATick {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * ### Heikin Ashi Candles (HA)
 *
 * The Heikin-Ashi technique averages price data to create a Japanese candlestick chart that filters out market noise.
 * Heikin-Ashi charts, developed by Munehisa Homma in the 1700s, share some characteristics with standard candlestick
 * charts but differ based on the values used to create each candle.
 *
 * Instead of using the open, high, low, and close like standard candlestick charts, the Heikin-Ashi technique uses a
 * modified formula based on two-period averages. This gives the chart a smoother appearance, making it easier to spot
 * trends and reversals, but also obscures gaps and some price data.
 *
 * **Formula**:
 *
 * - **Close** = (Open + High + Low + Close) / 4
 * - **Open** = (Previous Open + Previous Close) / 2 = (HAOpen[1] + HAClose[1]) / 2
 * - **High** = Max(High, Open, Close)
 * - **Low** = Min(Low, Open, Close)
 *
 * **Sources**:
 *
 * -  https://www.investopedia.com/terms/h/HA.asp
 */
export class HA extends Indicator<HAOutput, HATick> {
  protected override result: HAOutput[] = [];
  protected override generator;

  constructor(input: HAInput) {
    super(input);

    this.generator = this.haGenerator();
    this.generator.next();

    input.open.forEach((open, index) => {
      this.nextValue({
        open,
        high: input.high[index]!,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *haGenerator(): IterableIterator<HAOutput, never, HATick> {
    let tick = yield;
    let output: HAOutput;

    while (true) {
      const close = (tick.open + tick.high + tick.low + tick.close) / 4;
      const open =
        output !== undefined ? (output.open + output.close) / 2 : (tick.open + tick.close) / 2;
      const high = Math.max(tick.high, open, close);
      const low = Math.min(tick.low, open, close);

      output = {
        open,
        high,
        low,
        close,
      };

      tick = yield output;
    }
  }

  override nextValue(tick: HATick): HAOutput {
    let val: HAOutput = this.generator.next(tick).value;
    if (val === undefined) return undefined;

    val = {
      open: this.format(val.open),
      high: this.format(val.high),
      low: this.format(val.low),
      close: this.format(val.close),
    };

    this.result.push(val);

    return val;
  }

  static calculate(input: HAInput): HAOutput[] {
    return new HA(input).getResult();
  }
}
