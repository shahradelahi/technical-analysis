import { Indicator, IndicatorInput } from '@/indicator';
import { RollingWindow } from '@/utils/RollingWindow';

export interface ALMAInput extends IndicatorInput {
  values: number[];

  /**
   * It's period.
   * @default 10
   */
  period?: number;

  /**
   * Smoothing value.
   * @default 6.0
   */
  sigma?: number;

  /**
   * Value to offset the distribution min 0
   * @default 0.85
   */
  distributionOffset?: number;
}

export type ALMAOutput = number | undefined;

export type ALMATick = number;

/**
 * #### Arnaud Legoux Moving Average (ALMA)
 *
 * The ALMA moving average utilizes the curve of the Normal (Gauss) distribution,
 * which can be shifted from 0 to 1. This enables the regulation of smoothness and
 * high sensitivity of the indicator. Sigma is another parameter responsible for
 * shaping the curve coefficients. This moving average effectively reduces data lag
 * while simultaneously smoothing to minimize noise.
 *
 * **Sources:**
 *  - https://www.prorealcode.com/prorealtime-indicators/alma-arnaud-legoux-moving-average/
 */
export class ALMA extends Indicator<ALMAOutput, ALMATick> {
  period: number;
  distOffset: number;
  sigma: number;

  protected override result: ALMAOutput[] = [];
  protected override generator;

  constructor(input: ALMAInput) {
    super(input);

    this.period = input.period || 10;
    this.distOffset = input.distributionOffset || 0.85;
    this.sigma = input.sigma || 6.0;

    this.generator = this.almaGenerator();

    input.values.forEach((t) => {
      this.nextValue(t);
    });
  }

  private *almaGenerator(): IterableIterator<ALMAOutput, never, ALMATick> {
    // Pre-Calculations
    const m = this.distOffset * (this.period - 1);
    const s = this.period / this.sigma;
    const wtd = Array.from({ length: this.period }, (_, i) =>
      Math.exp((-1 * ((i - m) * (i - m))) / (2 * s * s))
    );
    const window = new RollingWindow(this.period + 1);

    let output: ALMAOutput;
    let tick = yield output;

    while (true) {
      window.push(tick);

      if (window.filled()) {
        // Calculate Result
        let windowSum = 0;
        let cumSum = 0;

        for (let j = 0; j < this.period; j++) {
          windowSum += wtd[j]! * window.at(this.period - j)!;
          cumSum += wtd[j]!;
        }

        output = windowSum / cumSum;
      }

      tick = yield output;
    }
  }

  static calculate(input: ALMAInput): ALMAOutput[] {
    return new ALMA(input).getResult();
  }
}
