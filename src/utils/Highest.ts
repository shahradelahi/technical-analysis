import { Indicator, IndicatorInput } from 'src/indicator';

import { FixedSizeLinkedList } from './FixedSizeLinkedList';

export interface HighestInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type HighestOutput = number | undefined;

export type HighestTick = number;

export class Highest extends Indicator<HighestOutput, HighestTick> {
  period: number;

  protected override result: HighestOutput[] = [];
  protected override generator;

  constructor(input: HighestInput) {
    super(input);
    this.period = input.period;

    this.generator = this.highestGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *highestGenerator(): IterableIterator<HighestOutput, never, number> {
    const periodList = new FixedSizeLinkedList(this.period, true, false, false);

    let tick = yield;
    let high;

    while (true) {
      periodList.push(tick);
      if (periodList.totalPushed >= this.period) {
        high = periodList.periodHigh;
      }
      tick = yield high;
    }
  }
}
