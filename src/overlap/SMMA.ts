import { Indicator } from '@/indicator';

import { SMA, SMAInput, SMAOutput } from './SMA';

export interface SMMAInput extends Omit<SMAInput, 'period'> {
  /**
   * It's period.
   * @default 7
   */
  period?: number;
}

export type SMMAOutput = SMAOutput;

export type SMMATick = number;

/**
 * ### Smoothed Moving Average (SMMA)
 *
 * The Smoothed Moving Average (SMMA) is a technical indicator that gives equal weight to recent and historical prices.
 * Unlike other moving averages, SMMA considers all available data in the series, not just a fixed period.
 * It is often used with longer timeframes compared to the Exponential Moving Average (EMA).
 *
 * **Sources**:
 *
 * - https://www.tradingview.com/support/solutions/43000591343-smoothed-moving-average/
 */
export class SMMA extends Indicator<SMMAOutput, SMMATick> {
  period: number;

  private readonly sma: SMA;

  protected override result: SMMAOutput[] = [];
  protected override generator;

  constructor(input: SMMAInput) {
    super(input);

    this.period = input.period || 7;

    this.sma = new SMA({ period: this.period, values: [] });

    this.generator = this.smmaGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *smmaGenerator(): IterableIterator<SMMAOutput, never, SMMATick> {
    let tick = yield;
    let smma: SMMAOutput;

    while (true) {
      const sma = this.sma.nextValue(tick);

      if (sma !== undefined && smma !== undefined) {
        smma = (smma * (this.period - 1) + tick) / this.period;
      } else if (sma !== undefined) {
        smma = sma;
      }

      tick = yield smma;
    }
  }

  static calculate(input: SMMAInput): SMMAOutput[] {
    return new SMMA(input).getResult();
  }
}
