import { Indicator, IndicatorInput } from '@/indicator';
import { RMA } from '@/overlap/RMA';
import { TrueRange } from '@/volatility/TrueRange';

export interface ATRInput extends IndicatorInput {
  low: number[];
  high: number[];
  close: number[];

  period: number;
}

export type ATROutput = number | undefined;

export interface ATRTick {
  high: number;
  low: number;
  close: number;
}

/**
 * Average True Range (ATR)
 *
 * Average True Range is used to measure volatility, especially volatility caused by
 * gaps or limit moves.
 *
 * ATR is calculated by first finding the True Range (TR) for each period, and then taking
 * the average of the TR values over a specified period.
 *
 * Sources:
 *     https://www.tradingview.com/wiki/Average_True_Range_(ATR)
 */
export class ATR extends Indicator<ATROutput, ATRTick> {
  private readonly tr: TrueRange;
  private readonly rma: RMA;

  protected override result: number[] = [];
  protected override generator;

  constructor(input: ATRInput) {
    super(input);

    this.tr = new TrueRange({ low: [], high: [], close: [] });
    this.rma = new RMA({ period: input.period, values: [] });

    this.generator = this.atrGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *atrGenerator(): IterableIterator<ATROutput, never, ATRTick> {
    let tick = yield;
    let tr, output;
    while (true) {
      tr = this.tr.nextValue({
        low: tick.low,
        high: tick.high,
        close: tick.close,
      });

      if (tr !== undefined) {
        output = this.rma.nextValue(tr);
      }

      tick = yield output;
    }
  }
}
