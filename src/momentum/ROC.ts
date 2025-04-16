import { Indicator, IndicatorInput } from '@/indicator';

import { MOM } from './MOM';

export interface ROCInput extends IndicatorInput {
  values: number[];
  period: number;

  /**
   * How much to magnify.
   * @default 100
   */
  scalar?: number;
}

export type ROCOutput = number | undefined;

export type ROCTick = number;

/**
 * ### Rate of Change (ROC)
 *
 * The Rate of Change (ROC) indicator, also known as Momentum, is a pure momentum oscillator.
 * It measures the percentage change in price compared to the price 'n' periods ago.
 *
 * **Formula:**
 * ```
 * ROC = ((Current Price - Price n periods ago) / Price n periods ago) * Scalar
 * Scalar = 100
 * ```
 *
 * **Sources:**
 * - [TradingView - Rate of Change (ROC)](https://www.tradingview.com/support/solutions/43000502343/)
 */
export class ROC extends Indicator<ROCOutput, ROCTick> {
  period: number;
  scalar: number;

  protected override result: ROCOutput[] = [];
  protected override generator;

  private readonly mom: MOM;

  constructor(input: ROCInput) {
    super(input);
    this.period = input.period;
    this.scalar = input.scalar || 100;

    this.mom = new MOM({ period: this.period, values: [] });

    this.generator = this.rocGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *rocGenerator(): IterableIterator<ROCOutput, never, ROCTick> {
    let tick = yield;
    let mom;
    let output;
    while (true) {
      mom = this.mom.nextValue(tick);
      if (mom !== undefined) {
        output = this.scalar * (mom / this.mom.window[0]!);
      }
      tick = yield output;
    }
  }
}
