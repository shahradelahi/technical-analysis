import { Indicator, IndicatorInput } from '@/indicator';

export interface VWAPInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  volume: number[];

  /**
   * Indicator calculation period. How frequently the VWAP calculation will be reset.
   * @default 1
   */
  anchorPeriod?: number;
}

export type VWAPOutput = number | undefined;

export interface VWAPTick {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Volume Weighted Average Price (VWAP)
 *
 * The Volume Weighted Average Price measures the average typical price
 * by volume. It is typically used with intraday charts to identify general
 * direction.
 *
 * Sources:
 *  - https://www.tradingview.com/wiki/Volume_Weighted_Average_Price_(VWAP)
 *  - https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/volume-weighted-average-price-vwap/
 *  - https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:vwap_intraday
 */
export class VWAP extends Indicator<VWAPOutput, VWAPTick> {
  public readonly anchorPeriod: number = 1;

  protected override result: VWAPOutput[] = [];
  protected override generator;

  constructor(input: VWAPInput) {
    super(input);

    this.generator = this.vwapGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
        volume: input.volume[index]!,
      });
    });
  }

  private *vwapGenerator(): IterableIterator<VWAPOutput, never, VWAPTick> {
    let tick = yield;
    let cumulativeTotal = 0,
      cumulativeVolume = 0;
    while (true) {
      // Reset when period changes
      if (this.result.length % this.anchorPeriod === 0) {
        cumulativeTotal = 0;
        cumulativeVolume = 0;
      }

      cumulativeTotal += ((tick.high + tick.low + tick.close) / 3) * tick.volume;
      cumulativeVolume += tick.volume;
      tick = yield cumulativeTotal / cumulativeVolume;
    }
  }
}
