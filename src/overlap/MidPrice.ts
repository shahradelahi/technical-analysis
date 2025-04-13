import { Indicator, IndicatorInput } from '@/indicator';
import { SMAOutput } from '@/overlap/SMA';

export interface MidPriceInput extends IndicatorInput {
  high: number[];
  low: number[];
  period: number;
}

export type MidPriceOutput = number | undefined;

export interface MidPriceTick {
  high: number;
  low: number;
}

export class MidPrice extends Indicator<MidPriceOutput, MidPriceTick> {
  period: number;
  high: number[];
  low: number[];

  result: MidPriceOutput[] = [];
  generator;

  constructor(input: MidPriceInput) {
    if (input.high.length !== input.low.length) {
      throw new Error('High and low arrays must have the same length.');
    }
    if (input.period <= 0) {
      throw new Error('Period must be greater than 0.');
    }

    super(input);

    this.period = input.period;
    this.high = input.high;
    this.low = input.low;

    this.generator = this.midPriceGenerator();
    this.generator.next();

    this.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: this.low[index]!,
      });
    });
  }

  private *midPriceGenerator(): IterableIterator<MidPriceOutput, never, MidPriceTick> {
    let tick = yield;
    let lowestLow: SMAOutput;
    let highestHigh: SMAOutput;
    let output: MidPriceOutput;

    let highs: number[] = [tick.high];
    let lows: number[] = [tick.low];

    while (true) {
      if (highs.length < this.period) {
        highs.push(tick.high);
        lows.push(tick.low);
        tick = yield;
      } else {
        highs = [...highs.slice(1), tick.high];
        lows = [...lows.slice(1), tick.low];

        lowestLow = Math.min(...lows);
        highestHigh = Math.max(...highs);

        if (lowestLow !== undefined && highestHigh !== undefined) {
          output = 0.5 * (lowestLow + highestHigh);
        }
        tick = yield output;
      }
    }
  }
}
