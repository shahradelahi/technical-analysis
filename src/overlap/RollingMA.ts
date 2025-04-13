import { SMAInput, SMAOutput } from 'src/overlap/SMA';

import { Indicator } from '@/indicator';

export type RollingMAInput = SMAInput;
export type RollingMAOutput = SMAOutput;
export type RollingMATick = number;

/**
 * Rolling Moving Average (RollingMA)
 */
export class RollingMA extends Indicator<RollingMAOutput, RollingMATick> {
  period: number;
  values: number[];

  protected result: RollingMAOutput[] = [];
  protected generator;

  constructor(input: RollingMAInput) {
    super(input);
    this.values = input.values;
    this.period = input.period;

    this.generator = this.rollingMovingAverageGenerator();
    this.generator.next();

    this.values.forEach((t) => this.nextValue(t));
  }

  private *rollingMovingAverageGenerator(): IterableIterator<SMAOutput, never, RollingMATick> {
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
