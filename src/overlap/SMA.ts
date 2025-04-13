import { Indicator, IndicatorInput } from '@/indicator';
import { LinkedList } from '@/utils/LinkedList';

export interface SMAInput extends IndicatorInput {
  period: number;
  values: number[];
}

export type SMAOutput = number | undefined;

export type SMATick = number;

/**
 * Simple Moving Average (SMA)
 */
export class SMA extends Indicator<SMAOutput, SMATick> {
  period: number;

  override result: SMATick[] = [];
  generator;

  constructor(input: SMAInput) {
    super(input);
    this.period = input.period;

    this.generator = this.smaGenerator();
    this.generator.next();

    input.values.forEach((t) => this.nextValue(t));
  }

  private *smaGenerator(): IterableIterator<SMAOutput, never, number> {
    const list = new LinkedList();

    let sum = 0;
    let counter = 1;
    let current = yield;
    let result;

    list.push(0);
    while (true) {
      if (counter < this.period) {
        counter++;
        sum = sum + current;
      } else {
        sum = sum - list.shift() + current;
        result = sum / this.period;
      }

      list.push(current);
      current = yield result;
    }
  }
}
