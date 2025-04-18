import { Indicator, IndicatorInput } from '@/indicator';
import { RollingWindow } from '@/utils/RollingWindow';

export interface MOMInput extends IndicatorInput {
  values: number[];
  period: number;
}

export type MOMOutput = number | undefined;

export type MOMTick = number;

/**
 * ### Momentum (MOM)
 *
 * The Momentum indicator (MOM) is a technical analysis tool used to measure the speed or strength of a security's price movement.
 * It essentially reflects the change in price over a specific period.
 *
 * **Formula:**
 *
 *  MOM = Close(period + 1) - Close(current)
 *
 * **Sources:**
 *
 * - http://www.onlinetradingconcepts.com/TechnicalAnalysis/Momentum.html
 */
export class MOM extends Indicator<MOMOutput, MOMTick> {
  period: number;

  readonly window: RollingWindow;

  protected override result: MOMOutput[] = [];
  protected override generator;

  constructor(input: MOMInput) {
    super(input);

    this.period = input.period || 14;

    this.window = new RollingWindow(this.period + 1);

    this.generator = this.momGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *momGenerator(): IterableIterator<MOMOutput, never, MOMTick> {
    let tick = yield;
    let output;

    while (true) {
      this.window.push(tick);

      if (this.window.filled()) {
        output = this.window.at(-1)! - this.window.at(0)!;
      }

      tick = yield output;
    }
  }
}
