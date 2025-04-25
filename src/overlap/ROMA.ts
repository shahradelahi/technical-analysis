import { Indicator } from '@/indicator';
import { RollingWindow } from '@/utils/RollingWindow';

import type { SMAInput, SMAOutput } from './SMA';

export type ROMAInput = SMAInput;
export type ROMAOutput = SMAOutput;
export type ROMATick = number;

/**
 * Rolling Moving Average (ROMA)
 */
export class ROMA extends Indicator<ROMAOutput, ROMATick> {
  period: number;

  protected override result: ROMAOutput[] = [];
  protected override generator;

  constructor(input: ROMAInput) {
    super(input);
    this.period = input.period || 10;

    this.generator = this.romaGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *romaGenerator(): IterableIterator<ROMAOutput, never, ROMATick> {
    let tick = yield;
    const window = new RollingWindow(this.period);
    let output: ROMAOutput;

    while (true) {
      window.push(tick);

      if (window.filled()) {
        output = window.avg();
      }

      tick = yield output;
    }
  }

  static calculate(input: ROMAInput): ROMAOutput[] {
    return new ROMA(input).getResult();
  }
}
