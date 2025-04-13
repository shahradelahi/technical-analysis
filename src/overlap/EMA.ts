import { SMA, SMAInput, SMAOutput } from 'src/overlap/SMA';

import { Indicator } from '@/indicator';

export interface EMAInput extends SMAInput {
  /**
   * Specify smoothing factor.
   * @default 2 / (period + 1)
   */
  alpha?: number;
}

export type EMAOutput = SMAOutput;

export type EMATick = number;

/**
 * Exponential Moving Average (EMA)
 *
 * Calculation:
 *
 * EMA = (current_price - previous_ema) × alpha + previous_ema
 * alpha = 2 / (period + 1)
 */
export class EMA extends Indicator<EMAOutput, EMATick> {
  period: number;
  alpha: number;

  private readonly sma: SMA;

  protected override result: EMAOutput[] = [];
  protected override generator;

  constructor(input: EMAInput) {
    super(input);

    this.period = input.period;
    this.alpha = input.alpha ?? 2 / (input.period + 1);

    this.sma = new SMA({ period: input.period, values: [] });

    this.generator = this.emaGenerator();
    this.generator.next();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *emaGenerator(): IterableIterator<EMAOutput, never, EMATick> {
    let tick = yield;
    let prev;

    while (true) {
      if (prev !== undefined && tick !== undefined) {
        prev = (tick - prev) * this.alpha + prev;
        tick = yield prev;
      } else {
        tick = yield;
        prev = this.sma.nextValue(tick);
        if (prev !== undefined) tick = yield prev;
      }
    }
  }
}
