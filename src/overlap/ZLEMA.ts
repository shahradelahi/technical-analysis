import { Indicator } from '@/indicator';
import { EMA } from '@/overlap/EMA';
import { RollingWindow } from '@/utils/RollingWindow';

import { SMAInput, SMAOutput } from './SMA';

export type ZLEMAInput = SMAInput;

export type ZLEMAOutput = SMAOutput;

export type ZLEMATick = number;

/**
 * ### Zero Lag Exponential Moving Average (ZLEMA)
 *
 * The Zero Lag Exponential Moving Average (ZLEMA) is a technical analysis indicator designed to
 * reduce the lag commonly associated with traditional moving averages. It achieves this by
 * incorporating a unique calculation method that emphasizes recent price data more heavily.
 *
 * ZLEMA is particularly useful for identifying trends and potential reversals in financial markets,
 * offering a smoother and more responsive alternative to other moving averages.
 *
 * **Key Features:**
 * - **Reduced Lag:** ZLEMA minimizes the delay in reflecting price changes, providing more timely signals.
 * - **Smoothness:** Despite its responsiveness, ZLEMA maintains a relatively smooth curve, filtering out excessive noise.
 *
 * **Formula:**
 * - lag = (period - 1) / 2
 * - zlema = ema(2 * data - data(-lag))
 *
 * **References:**
 * - https://en.wikipedia.org/wiki/Zero_lag_exponential_moving_average
 * - https://www.forexdominion.com/zero-lag-exponential-moving-average.html
 */
export class ZLEMA extends Indicator<ZLEMAOutput, ZLEMATick> {
  period: number;
  lag: number;

  private readonly ema: EMA;

  protected override result: ZLEMAOutput[] = [];
  protected override generator;

  constructor(input: ZLEMAInput) {
    super(input);

    this.period = input.period || 10;
    this.lag = Math.floor(0.5 * (this.period - 1));

    this.ema = new EMA({ period: this.period, values: [] });

    this.generator = this.zlemaGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *zlemaGenerator(): IterableIterator<ZLEMAOutput, never, ZLEMATick> {
    const window = new RollingWindow(this.lag + 1);

    let tick = yield;
    let zlema: ZLEMAOutput;

    while (true) {
      window.push(tick);

      if (window.filled()) {
        const close = 2 * tick - window.at(0)!;
        zlema = this.ema.nextValue(close);
      }

      tick = yield zlema;
    }
  }

  static calculate(input: ZLEMAInput): ZLEMAOutput[] {
    return new ZLEMA(input).getResult();
  }
}
