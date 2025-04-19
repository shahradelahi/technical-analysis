import { Indicator, IndicatorInput } from '@/indicator';
import { EMA } from '@/overlap/EMA';

import { HA } from './HA';

export interface SHAInput extends IndicatorInput {
  /**
   * The period of the Moving Average (MA).
   *
   * @default 10
   */
  period?: number;

  low: number[];
  open: number[];
  high: number[];
  close: number[];
}

export type SHAOutput =
  | {
      open: number;
      high: number;
      low: number;
      close: number;
    }
  | undefined;

export interface SHATick {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * ### Smoothed Heikin Ashi Candles (SHA)
 *
 * The Smoothed Heikin Ashi (SHA) indicator is a modified version of the traditional Heikin Ashi technique, designed to further reduce noise and provide a clearer view of the underlying trend.
 * It achieves this by incorporating moving averages both before and after the Heikin Ashi calculation.
 *
 * **How it Works:**
 *
 * 1.  **Pre-Smoothing:** Before calculating the Heikin Ashi values, a moving average is applied to the standard OHLC (Open, High, Low, Close) data. This initial smoothing helps to filter out short-term fluctuations.
 * 2.  **Heikin Ashi Calculation:** The smoothed OHLC data is then used to calculate the Heikin Ashi values using the standard Heikin Ashi formulas.
 * 3.  **Post-Smoothing:** After the Heikin Ashi values are calculated, another moving average is applied to the resulting Heikin Ashi candles. This second smoothing step further refines the trend and reduces noise.
 *
 * **Sources:**
 *
 * - https://www.tradingview.com/script/pjl3mIvc-Smoothed-Heiken-Ashi/
 */
export class SHA extends Indicator<SHAOutput, SHATick> {
  protected override result: SHAOutput[] = [];
  protected override generator;

  period: number;

  private readonly oMa: EMA;
  private readonly cMa: EMA;
  private readonly hMa: EMA;
  private readonly lMa: EMA;

  private readonly ha: HA;

  constructor(input: SHAInput) {
    super(input);
    this.period = input.period || 10;

    this.oMa = new EMA({ period: this.period, values: [] });
    this.cMa = new EMA({ period: this.period, values: [] });
    this.hMa = new EMA({ period: this.period, values: [] });
    this.lMa = new EMA({ period: this.period, values: [] });

    this.ha = new HA({ low: [], open: [], high: [], close: [] });

    this.generator = this.shaGenerator();
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

  private *shaGenerator(): IterableIterator<SHAOutput, never, SHATick> {
    let tick = yield;
    let result: SHAOutput;

    let open, high, low, close: number;
    while (true) {
      const haCandle = this.ha.nextValue(tick);
      if (!haCandle) {
        tick = yield undefined;
        continue;
      }

      ({ open, high, low, close } = haCandle);

      const o = this.oMa.nextValue(open);
      const c = this.cMa.nextValue(close);
      const h = this.hMa.nextValue(high);
      const l = this.lMa.nextValue(low);

      if (o !== undefined && c !== undefined && h !== undefined && l !== undefined) {
        result = {
          open: o,
          high: h,
          low: l,
          close: c,
        };
      }

      tick = yield result;
    }
  }

  override nextValue(tick: SHATick): SHAOutput {
    let val: SHAOutput = this.generator.next(tick).value;
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

  static calculate(input: SHAInput): SHAOutput[] {
    return new SHA(input).getResult();
  }
}
