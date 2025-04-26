import { Indicator, IndicatorInput } from '@/indicator';

export interface RSXInput extends IndicatorInput {
  values: number[];

  /**
   * It's period.
   * @default 14
   */
  period?: number;
}

export type RSXOutput = number | undefined;

export type RSXTick = number;

/**
 * ### Relative Strength Xtra (RSX)
 *
 * The Relative Strength Xtra (RSX) is a momentum oscillator that builds upon the popular Relative Strength Index (RSI).
 * It was inspired by the work of Jurik Research and the implementation is based on published code from prorealcode.com.
 *
 * **Key Features:**
 *
 * -   **Noise Reduction:** RSX is designed to reduce noise compared to traditional RSI, providing a smoother signal.
 * -   **Enhanced Clarity:** It offers a clearer view of momentum and the velocity of price movements.
 * -   **Slight Delay:** While providing enhanced clarity, RSX introduces a slight delay compared to RSI.
 *
 * **Sources:**
 *
 *  - http://www.jurikres.com/catalog1/ms_rsx.htm
 *  - https://www.prorealcode.com/prorealtime-indicators/jurik-rsx/
 */
export class RSX extends Indicator<RSXOutput, RSXTick> {
  period: number;

  protected override result: RSXOutput[] = [];
  protected override generator;

  constructor(input: RSXInput) {
    super(input);

    this.period = input.period || 14;

    this.generator = this.rsxGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *rsxGenerator(): IterableIterator<RSXOutput, never, RSXTick> {
    let index = 0;
    let tick = yield;
    let output: RSXOutput;

    let vC = 0,
      v1C = 0;
    let v4 = 0,
      v8 = 0,
      v10 = 0,
      v14 = 0,
      v18 = 0,
      v20 = 0;

    let f0 = 0,
      f8 = 0,
      f10 = 0,
      f18 = 0,
      f20 = 0,
      f28 = 0,
      f30 = 0,
      f38 = 0;
    let f40 = 0,
      f48 = 0,
      f50 = 0,
      f58 = 0,
      f60 = 0,
      f68 = 0,
      f70 = 0,
      f78 = 0;
    let f80 = 0,
      f88 = 0,
      f90 = 0;

    while (true) {
      if (index < this.period) {
        index++;
        tick = yield;
        continue;
      }

      if (f90 == 0) {
        f90 = 1.0;
        f0 = 0.0;
        f88 = this.period - 1 >= 5 ? this.period - 1 : 5;
        f8 = 100 * tick;
        f18 = 3 / (this.period + 2);
        f20 = 1 - f18;
      } else {
        if (f88 <= f90) {
          f90 = f88 + 1;
        } else {
          f90 = f90 + 1;
        }
        f10 = f8;
        f8 = 100 * tick;
        v8 = f8 - f10;
        f28 = f20 * f28 + f18 * v8;
        f30 = f18 * f28 + f20 * f30;
        vC = 1.5 * f28 - 0.5 * f30;
        f38 = f20 * f38 + f18 * vC;
        f40 = f18 * f38 + f20 * f40;
        v10 = 1.5 * f38 - 0.5 * f40;
        f48 = f20 * f48 + f18 * v10;
        f50 = f18 * f48 + f20 * f50;
        v14 = 1.5 * f48 - 0.5 * f50;
        f58 = f20 * f58 + f18 * Math.abs(v8);
        f60 = f18 * f58 + f20 * f60;
        v18 = 1.5 * f58 - 0.5 * f60;
        f68 = f20 * f68 + f18 * v18;
        f70 = f18 * f68 + f20 * f70;
        v1C = 1.5 * f68 - 0.5 * f70;
        f78 = f20 * f78 + f18 * v1C;
        f80 = f18 * f78 + f20 * f80;
        v20 = 1.5 * f78 - 0.5 * f80;

        if (f88 >= f90 && f8 != f10) {
          f0 = 1.0;
        }
        if (f88 == f90 && f0 == 0.0) {
          f90 = 0.0;
        }
      }

      if (f88 < f90 && v20 > 0.0000000001) {
        v4 = (v14 / v20 + 1) * 50;
        if (v4 > 100) {
          v4 = 100;
        }
        if (v4 < 0) {
          v4 = 0;
        }
      } else {
        v4 = 50;
      }

      output = v4;
      tick = yield output;
    }
  }

  static calculate(input: RSXInput): RSXOutput[] {
    return new RSX(input).getResult();
  }
}
