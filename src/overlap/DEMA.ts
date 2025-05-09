import { Indicator, IndicatorInput } from '@/indicator';

import { EMA } from './EMA';

export interface DEMAInput extends IndicatorInput {
  values: number[];

  /**
   * It's period.
   * @default 10
   */
  period?: number;
}

export type DEMAOutput = number | undefined;

export type DEMATick = number;

/**
 * ### Double Exponential Moving Average (DEMA)
 *
 * The Double Exponential Moving Average attempts to provide a smoother average with less lag compared to a standard
 * Exponential Moving Average (EMA). It achieves this by taking a double-smoothed
 * EMA of the price data.
 *
 * **Calculation:**
 *
 * DEMA = 2 * EMA(price) - EMA(first_ema)
 *
 * **Sources:**
 *  - https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/double-exponential-moving-average-dema/
 */
export class DEMA extends Indicator<DEMAOutput, DEMATick> {
  period: number;

  private readonly ema1: EMA;
  private readonly ema2: EMA;

  protected override result: DEMAOutput[] = [];
  protected override generator;

  constructor(input: DEMAInput) {
    super(input);

    this.period = input.period || 10;

    this.ema1 = new EMA({ period: this.period, values: [] });
    this.ema2 = new EMA({ period: this.period, values: [] });

    this.generator = this.emaGenerator();
    this.generator.next();

    input.values.forEach((t) => {
      this.nextValue(t);
    });
  }

  private *emaGenerator(): IterableIterator<DEMAOutput, never, DEMATick> {
    let output: DEMAOutput;
    let tick = yield output;

    while (true) {
      const ema1 = this.ema1.nextValue(tick);
      if (ema1 !== undefined) {
        const ema2 = this.ema2.nextValue(ema1);
        if (ema2 !== undefined) {
          output = 2 * ema1 - ema2;
        }
      }
      tick = yield output;
    }
  }

  static calculate(input: DEMAInput): DEMAOutput[] {
    return new DEMA(input).getResult();
  }
}
