import { Indicator, IndicatorInput } from '@/indicator';
import { SMA } from '@/overlap/SMA';
import { zero } from '@/utils/number';

export interface StochasticInput extends IndicatorInput {
  low: number[];
  high: number[];
  close: number[];

  /**
   * The Fast %K period.
   * @default 14
   */
  fast?: number;

  /**
   * The Slow %K period.
   * @default 3
   */
  slow?: number;

  /**
   * The Slow %D period.
   * @default 3
   */
  smoothing?: number;
}

export interface StochasticOutput {
  k?: number;
  d?: number;
}

export interface StochasticTick {
  low: number;
  high: number;
  close: number;
}

/**
 * ### Stochastic (STOCH)
 *
 * The Stochastic Oscillator (STOCH) was developed by George Lane in the 1950's. He believed this indicator was
 * a good way to measure momentum because changes in momentum precede changes in price.
 *
 * It is a range-bound oscillator with two lines moving between 0 and 100. The first line (%K) displays
 * the current close in relation to the period's high/low range. The second line (%D) is a
 * Simple Moving Average of the %K line. The most common choices are a 14 period %K and
 * a 3 period SMA for %D.
 *
 * **Calculation:**
 * -   `%K = (Current Close - Lowest Low) / (Highest High - Lowest Low) * 100`
 * -   `%D = SMA of %K`
 *
 * **Sources:**
 *  - https://www.tradingview.com/wiki/Stochastic_(STOCH)
 *  - https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=332&Name=KD_-_Slow
 */
export class Stochastic extends Indicator<StochasticOutput, StochasticTick> {
  fast: number;
  slow: number;
  smoothing: number;

  private readonly kMa: SMA;
  private readonly dMa: SMA;

  protected override result: StochasticOutput[] = [];
  protected override generator;

  constructor(input: StochasticInput) {
    super(input);
    this.fast = input.fast || 14;
    this.slow = input.slow || 3;
    this.smoothing = input.smoothing || 3;

    this.kMa = new SMA({ period: this.smoothing, values: [] });
    this.dMa = new SMA({ period: this.slow, values: [] });

    this.generator = this.stochasticGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *stochasticGenerator(): IterableIterator<StochasticOutput, never, StochasticTick> {
    const windowSize = this.fast;
    const empty: StochasticOutput = { k: undefined, d: undefined };

    let index = 1;
    let tick = yield empty;
    let window = [tick];

    while (true) {
      if (index < this.fast) {
        index++;
        tick = yield empty;
      } else {
        // Calculate Stochastic
        const lowestLow = Math.min(...window.map((w) => w.low));
        const highestHigh = Math.max(...window.map((w) => w.high));

        let stochastic = 100 * (tick.close - lowestLow);
        stochastic /= zero(highestHigh - lowestLow);

        const k = this.kMa.nextValue(stochastic);
        const d = k !== undefined ? this.dMa.nextValue(k) : undefined;

        tick = yield { k, d };
      }

      // Update window
      window.push(tick);
      window = window.slice(-windowSize);
    }
  }
}
