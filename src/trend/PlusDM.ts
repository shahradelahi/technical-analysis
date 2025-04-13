import { Indicator, IndicatorInput } from '@/indicator';

export interface PlusDMInput extends IndicatorInput {
  low: number[];
  high: number[];
}

export type PlusDMOutput = number | undefined;

export interface PlusDMTick {
  high: number;
  low: number;
}

export class PlusDM extends Indicator<PlusDMOutput, PlusDMTick> {
  protected override result: PlusDMOutput[] = [];
  protected override generator;

  constructor(input: PlusDMInput) {
    super(input);

    this.generator = this.plusDMGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
      });
    });
  }

  private *plusDMGenerator(): IterableIterator<PlusDMOutput, never, PlusDMTick> {
    let tick = yield;
    let plusDm;
    let last;
    while (true) {
      if (last !== undefined) {
        const upMove = tick.high - last.high;
        const downMove = last.low - tick.low;
        plusDm = upMove > downMove && upMove > 0 ? upMove : 0;
      }
      last = tick;
      tick = yield plusDm;
    }
  }
}
