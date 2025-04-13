import { Indicator, IndicatorInput } from '@/indicator';
import { SMA } from '@/overlap/SMA';

export interface AOInput extends IndicatorInput {
  high: number[];
  low: number[];

  fastPeriod?: number;
  slowPeriod?: number;
}

export type AOOutput = number | undefined;

export interface AOTick {
  high: number;
  low: number;
}

/**
 * Awesome Oscillator (AO)
 *
 * The Awesome Oscillator is an indicator used to measure a security's momentum.
 * AO is generally used to affirm trends or to anticipate possible reversals.
 *
 * Sources:
 * - https://www.tradingview.com/wiki/Awesome_Oscillator_(AO)
 * - https://www.ifcm.co.uk/ntx-indicators/awesome-oscillator
 */
export class AO extends Indicator<AOOutput, AOTick> {
  high: number[];
  low: number[];

  fastPeriod: number;
  slowPeriod: number;

  private slowSMA: SMA;
  private fastSMA: SMA;

  protected override result: number[] = [];
  protected override generator;

  constructor(input: AOInput) {
    super(input);
    this.high = input.high;
    this.low = input.low;

    this.fastPeriod = input.fastPeriod || 5;
    this.slowPeriod = input.slowPeriod || 34;

    this.slowSMA = new SMA({ values: [], period: this.slowPeriod });
    this.fastSMA = new SMA({ values: [], period: this.fastPeriod });

    this.generator = this.aoGenerator();
    this.generator.next();

    this.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: this.low[index]!,
      });
    });
  }

  private *aoGenerator(): IterableIterator<AOOutput, never, AOTick> {
    let tick = yield;
    let medianPrice, slowSmaValue, fastSmaValue;
    let result;
    while (true) {
      medianPrice = (tick.high + tick.low) / 2;

      slowSmaValue = this.slowSMA.nextValue(medianPrice);
      fastSmaValue = this.fastSMA.nextValue(medianPrice);

      if (slowSmaValue !== undefined && fastSmaValue !== undefined) {
        result = fastSmaValue - slowSmaValue;
      }

      tick = yield result;
    }
  }
}
