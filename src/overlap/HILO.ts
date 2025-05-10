import { Indicator, IndicatorInput } from '@/indicator';

import { SMA } from './SMA';

export interface HILOInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];

  /**
   * It's period.
   * @default 13
   */
  highPeriod?: number;

  /**
   * It's period.
   * @default 21
   */
  lowPeriod?: number;
}

export interface HILOOutput {
  line: number | undefined;
  long: number | undefined;
  short: number | undefined;
}

export interface HILOTick {
  high: number;
  low: number;
  close: number;
}

/**
 * #### Gann HiLo Activator (HiLo)
 *
 * The Gann High Low Activator Indicator was created by Robert Krausz, this moving average-based trend
 * indicator uses two simple moving averages to track the highs and lows of a price series. The
 * close of each period determines which curve is plotted.
 *
 * **Sources:**
 *  - https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=447&Name=Gann_HiLo_Activator
 *  - https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/simple-moving-average-sma/
 *  - https://www.tradingview.com/script/XNQSLIYb-Gann-High-Low/
 */
export class HILO extends Indicator<HILOOutput, HILOTick> {
  highPeriod: number;
  lowPeriod: number;

  protected override result: HILOOutput[] = [];
  protected override generator;

  private readonly highMa: SMA;
  private readonly lowMa: SMA;

  constructor(input: HILOInput) {
    super(input);

    this.highPeriod = input.highPeriod || 13;
    this.lowPeriod = input.lowPeriod || 21;

    this.highMa = new SMA({ period: this.highPeriod, values: [] });
    this.lowMa = new SMA({ period: this.lowPeriod, values: [] });

    this.generator = this.hiloGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *hiloGenerator(): IterableIterator<HILOOutput, never, HILOTick> {
    let output: HILOOutput = { line: undefined, long: undefined, short: undefined };
    let tick = yield output;
    let prevHighMa;
    let prevLowMa;

    while (true) {
      const highMa = this.highMa.nextValue(tick.high);
      const lowMa = this.lowMa.nextValue(tick.low);

      if (highMa !== undefined && lowMa !== undefined) {
        const prev = this.result.at(-1);

        if (tick.close > prevHighMa!) {
          output = { line: lowMa, long: lowMa, short: undefined };
        } else if (tick.close < prevLowMa!) {
          output = { line: highMa, long: undefined, short: highMa };
        } else {
          output = { line: prev?.line, long: prev?.line, short: prev?.line };
        }
      }

      prevHighMa = highMa;
      prevLowMa = lowMa;

      tick = yield output;
    }
  }

  override nextValue(tick: HILOTick) {
    let val = this.generator.next(tick).value as HILOOutput;
    val = {
      line: val.line ? this.format(val.line) : undefined,
      long: val.long ? this.format(val.long) : undefined,
      short: val.short ? this.format(val.short) : undefined,
    } satisfies HILOOutput;

    this.result.push(val);

    return val;
  }

  static calculate(input: HILOInput): HILOOutput[] {
    return new HILO(input).getResult();
  }
}
