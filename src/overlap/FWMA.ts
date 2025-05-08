import { Indicator } from '@/indicator';
import { fibonacci } from '@/math/fibonacci';
import { weights } from '@/utils/number';
import { RollingWindow } from '@/utils/RollingWindow';

import { SMAInput, SMAOutput } from './SMA';

export type FWMAInput = SMAInput;

export type FWMAOutput = SMAOutput;

export type FWMATick = number;

/**
 * Fibonacci's Weighted Moving Average (FWMA)
 *
 * Fibonacci's Weighted Moving Average is similar to a Weighted Moving Average
 * (WMA) where the weights are based on the Fibonacci Sequence.
 *
 * Source: pandas_ta
 */
export class FWMA extends Indicator<FWMAOutput, FWMATick> {
  period: number;

  protected override result: FWMAOutput[] = [];
  protected override generator;

  constructor(input: FWMAInput) {
    super(input);

    this.period = input.period || 10;

    this.generator = this.fwmaGenerator();
    this.generator.next();

    input.values.forEach((t) => {
      this.nextValue(t);
    });
  }

  private *fwmaGenerator(): IterableIterator<FWMAOutput, never, FWMATick> {
    const fibs = fibonacci(this.period, { weighted: true });
    const fibWeight = weights(fibs);
    const window = new RollingWindow(this.period);

    let tick: FWMATick = yield;
    let output: FWMAOutput;

    while (true) {
      window.push(tick);

      if (window.filled()) {
        output = fibWeight(window);
      }

      tick = yield output;
    }
  }

  static calculate(input: FWMAInput): FWMAOutput[] {
    return new FWMA(input).getResult();
  }
}
