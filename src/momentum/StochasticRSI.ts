import { Indicator, IndicatorInput } from '@/indicator';
import { SMA } from '@/overlap/SMA';
import { zero } from '@/utils/number';
import { RollingWindow } from '@/utils/RollingWindow';

import { RSI } from './RSI';

export interface StochasticRSIInput extends IndicatorInput {
  values: number[];

  /**
   * The STOCHRSI period.
   * @default 14
   */
  period: number;

  /**
   * The RSI period.
   * @default 14
   */
  rsiPeriod: number;

  /**
   * The %K period.
   * @default 3
   */
  kPeriod: number;

  /**
   * The Slow %K period.
   * @default 3
   */
  dPeriod: number;
}

export interface StochasticRSIOutput {
  stochRSI?: number;
  k?: number;
  d?: number;
}

export type StochasticRSITick = number;

/**
 * ### Stochastic RSI Oscillator (STOCHRSI)
 *
 * The Stochastic RSI (STOCHRSI) is a momentum indicator that combines the concepts of the Relative Strength Index (RSI) and the Stochastic Oscillator.
 * It was developed by Tushar Chande and Stanley Kroll and introduced in their article "Stochastic RSI and Dynamic Momentum Index," published in Stock & Commodities V.11:5 (189-199).
 *
 * **Key Concepts:**
 * - **Range-Bound Oscillator:** STOCHRSI oscillates between 0 and 100, indicating overbought and oversold conditions.
 * - **%K Line:** Represents the current RSI value in relation to its high/low range over a specified period.
 * - **%D Line:** A Simple Moving Average (SMA) of the %K line, providing a smoother signal.
 * - **Common Parameters:** Typically, a 14-period RSI is used for %K, and a 3-period SMA is used for %D.
 *
 * **How it Works:**
 * STOCHRSI first calculates the RSI of the input data. Then, it applies the Stochastic Oscillator formula to the RSI values.
 *
 * **Sources:**
 *
 * - https://www.tradingview.com/wiki/Stochastic_(STOCH)
 */
export class StochasticRSI extends Indicator<StochasticRSIOutput, StochasticRSITick> {
  rsiPeriod: number;
  stochPeriod: number;
  kPeriod: number;
  dPeriod: number;

  private readonly rsi: RSI;
  private readonly kMa: SMA;
  private readonly dMa: SMA;

  protected override result: StochasticRSIOutput[] = [];
  protected override generator;

  constructor(input: StochasticRSIInput) {
    super(input);
    this.stochPeriod = input.period;
    this.rsiPeriod = input.rsiPeriod;
    this.kPeriod = input.kPeriod;
    this.dPeriod = input.dPeriod;

    this.rsi = new RSI({ period: this.rsiPeriod, values: [] });
    this.kMa = new SMA({ period: this.kPeriod, values: [] });
    this.dMa = new SMA({ period: this.dPeriod, values: [] });

    this.generator = this.stochRSIGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *stochRSIGenerator(): IterableIterator<StochasticRSIOutput, never, StochasticRSITick> {
    let output: StochasticRSIOutput = { stochRSI: undefined, k: undefined, d: undefined };
    let tick = yield output;
    const window = new RollingWindow(this.rsiPeriod);

    while (true) {
      const rsi = this.rsi.nextValue(tick);
      if (rsi) {
        window.push(rsi);
      }

      if (window.filled()) {
        // Calculate Stochastic
        const lowest = window.lowest();
        const highest = window.highest();

        let stochastic = 100 * (rsi! - lowest);
        stochastic /= zero(highest - lowest);

        const k = this.kMa.nextValue(stochastic);
        const d = k !== undefined ? this.dMa.nextValue(k) : undefined;

        output = { stochRSI: stochastic, k, d };
      }

      tick = yield output;
    }
  }

  static calculate(input: StochasticRSIInput): StochasticRSIOutput[] {
    return new StochasticRSI(input).getResult();
  }

  override nextValue(tick: StochasticRSITick): StochasticRSIOutput | undefined {
    let val = this.generator.next(tick).value;
    if (!val) return {};

    val = {
      stochRSI: val.stochRSI !== undefined ? this.format(val.stochRSI) : undefined,
      k: val.k !== undefined ? this.format(val.k) : undefined,
      d: val.d !== undefined ? this.format(val.d) : undefined,
    } satisfies StochasticRSIOutput;

    this.result.push(val);

    return val;
  }
}
