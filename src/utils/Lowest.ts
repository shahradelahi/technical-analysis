import { Indicator, IndicatorInput } from 'src/indicator';

import { FixedSizeLinkedList } from './FixedSizeLinkedList';

export interface LowestInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type LowestOutput = number | undefined;

export type LowestTick = number;

export class Lowest extends Indicator<LowestOutput, LowestTick> {
  period: number;

  protected override result: LowestOutput[] = [];
  protected override generator;

  constructor(input: LowestInput) {
    super(input);
    this.period = input.period;

    this.generator = this.lowestGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *lowestGenerator(): IterableIterator<LowestOutput, never, number> {
    const periodList = new FixedSizeLinkedList(this.period, false, true, false);

    let tick = yield;
    let low;

    while (true) {
      periodList.push(tick);
      if (periodList.totalPushed >= this.period) {
        low = periodList.periodLow;
      }
      tick = yield low;
    }
  }
}
