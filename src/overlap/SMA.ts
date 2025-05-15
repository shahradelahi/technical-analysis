import { Indicator, IndicatorInput } from '@/indicator';
import { RollingWindow } from '@/utils/RollingWindow';

export interface SMAInput extends IndicatorInput {
  values: number[];

  /**
   * It's period.
   * @default 10
   */
  period?: number;
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
    this.period = input.period || 10;

    this.generator = this.smaGenerator();
    this.generator.next();

    input.values.forEach((t) => {
      this.nextValue(t);
    });
  }

  private *smaGenerator(): IterableIterator<SMAOutput, never, SMATick> {
    const window = new RollingWindow(this.period);

    let tick = yield;
    let output: SMAOutput;

    while (true) {
      window.push(tick);
      output = window.filled() ? window.avg() : undefined;
      tick = yield output;
    }
  }

  static calculate(input: SMAInput): SMAOutput[] {
    return new SMA(input).getResult();
  }
}
