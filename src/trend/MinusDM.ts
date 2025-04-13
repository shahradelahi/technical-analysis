import { Indicator, IndicatorInput } from '@/indicator';

export interface MinusDMInput extends IndicatorInput {
  low: number[];
  high: number[];
}

export type MinusDMOutput = number | undefined;

export interface MinusDMTick {
  high: number;
  low: number;
}

export class MinusDM extends Indicator<MinusDMOutput, MinusDMTick> {
  protected override result: MinusDMOutput[] = [];
  protected override generator;

  constructor(input: MinusDMInput) {
    super(input);

    this.generator = this.minusDMGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
      });
    });
  }

  private *minusDMGenerator(): IterableIterator<MinusDMOutput, never, MinusDMTick> {
    let tick = yield;
    let minusDm;
    let last;
    while (true) {
      if (last !== undefined) {
        const upMove = tick.high - last.high;
        const downMove = last.low - tick.low;
        minusDm = downMove > upMove && downMove > 0 ? downMove : 0;
      }
      last = tick;
      tick = yield minusDm;
    }
  }
}
