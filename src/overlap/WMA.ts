import { SMAInput } from 'src/overlap/SMA';

import { Indicator } from '@/indicator';
import { LinkedList } from '@/utils/LinkedList';

export type WMAInput = SMAInput;
export type WMAOutput = number | undefined;
export type WMATick = number;

/**
 * Weighted Moving Average (WMA)
 *
 * The Weighted Moving Average where the weights are linearly increasing and
 * the most recent data has the heaviest weight.
 *
 * Sources:
 * - https://en.wikipedia.org/wiki/Moving_average#Weighted_moving_average
 */
export class WMA extends Indicator<WMAOutput, WMATick> {
  period: number;
  values: number[];
  denominator: number;

  override result: WMAOutput[] = [];
  override generator;

  constructor(input: WMAInput) {
    super(input);
    this.period = input.period || 10;
    this.values = input.values;

    this.denominator = (this.period * (this.period + 1)) / 2;

    this.generator = this.wmaGenerator();
    this.generator.next();

    this.values.forEach((t) => this.nextValue(t));
  }

  private *wmaGenerator(): IterableIterator<WMAOutput, never, WMATick> {
    const data = new LinkedList();

    while (true) {
      if (data.length < this.period) {
        data.push(yield);
        continue;
      }

      let result = 0;

      data.forEach((v, idx) => {
        result += (v * (idx + 1)) / this.denominator;
      });

      data.shift();
      data.push(yield result);
    }
  }

  static calculate(input: WMAInput): WMAOutput[] {
    return new WMA(input).getResult();
  }
}
