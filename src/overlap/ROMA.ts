import { SMAInput, SMAOutput } from 'src/overlap/SMA';

import { Indicator } from '@/indicator';

export type ROMAInput = SMAInput;
export type ROMAOutput = SMAOutput;
export type ROMATick = number;

/**
 * Rolling Moving Average (ROMA)
 */
export class ROMA extends Indicator<ROMAOutput, ROMATick> {
  period: number;
  values: number[];

  protected result: ROMAOutput[] = [];
  protected generator;

  constructor(input: ROMAInput) {
    super(input);
    this.values = input.values;
    this.period = input.period || 10;

    this.generator = this.rollingMovingAverageGenerator();
    this.generator.next();

    this.values.forEach((t) => this.nextValue(t));
  }

  private *rollingMovingAverageGenerator(): IterableIterator<SMAOutput, never, ROMATick> {
    let tick = yield;
    let window: number[] = [tick];
    while (true) {
      if (window.length < this.period) {
        window.push(tick);
        tick = yield;
      } else {
        window = [...window.slice(1), tick];
        const average = window.reduce((sum, cur) => sum + cur, 0) / this.period;
        tick = yield average;
      }
    }
  }
}
