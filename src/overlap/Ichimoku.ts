import { Indicator, IndicatorInput } from '@/indicator';
import { MidPrice, MidPriceTick } from '@/overlap/MidPrice';

export interface IchimokuInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];

  /**
   * Tenkan-sen - The period for the conversion line
   * @default 9
   */
  conversionPeriod?: number;

  /**
   * Kijun-sen - The period for the baseline
   * @default 26
   */
  basePeriod?: number;

  /**
   * Senkou
   * @default 52
   */
  spanPeriod?: number;
}

export interface IchimokuOutput {
  /**
   * Tenkan-sen
   * Conversion Line
   */
  conversion?: number;

  /**
   * Kijun-sen
   * Base Line
   */
  base?: number;

  /**
   * Senkou Span A
   */
  spanA?: number;

  /**
   * Senkou Span B
   */
  spanB?: number;
}

export interface IchimokuTick {
  high: number;
  low: number;
  close: number;
}

/**
 * Ichimoku Kinkō Hyō (Ichimoku)
 *
 * Developed Pre WWII as a forecasting model for financial markets.
 *
 * Sources:
 *  - https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/ichimoku-ich
 */
export class Ichimoku extends Indicator<IchimokuOutput, IchimokuTick> {
  high: number[];
  low: number[];
  close: number[];

  conversionPeriod: number;
  basePeriod: number;
  spanPeriod: number;

  private tenkanSen: MidPrice;
  private kijunSen: MidPrice;
  private spanB: MidPrice;

  protected override result: IchimokuOutput[] = [];

  // @ts-expect-error generator wont yield output
  protected override generator;

  constructor(input: IchimokuInput) {
    super(input);

    this.high = input.high;
    this.low = input.low;
    this.close = input.close;

    this.conversionPeriod = input.conversionPeriod || 9;
    this.basePeriod = input.basePeriod || 26;
    this.spanPeriod = input.spanPeriod || 52;

    this.tenkanSen = new MidPrice({ period: this.conversionPeriod, high: [], low: [] });
    this.kijunSen = new MidPrice({ period: this.basePeriod, high: [], low: [] });
    this.spanB = new MidPrice({ period: this.spanPeriod, high: [], low: [] });

    this.generator = this.ichimokuGenerator();
    this.generator.next();

    this.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: this.low[index]!,
        close: this.close[index]!,
      });
    });
  }

  private *ichimokuGenerator(): IterableIterator<undefined, never, IchimokuTick> {
    let index = 0;
    let tick = yield;

    while (true) {
      // Feed tenkanSen, kijunSen and spanB with current tick
      const midPriceTick: MidPriceTick = { high: tick.high, low: tick.low };
      const tenkanSen = this.tenkanSen.nextValue(midPriceTick);
      const kijunSen = this.kijunSen.nextValue(midPriceTick);

      const spanA = tenkanSen && kijunSen ? (tenkanSen + kijunSen) / 2 : NaN;
      const spanB = this.spanB.nextValue(midPriceTick) || NaN;

      // Calculate and return Ichimoku output
      this.result[index] = {
        conversion: tenkanSen || NaN,
        base: kijunSen || NaN,
        spanA: NaN,
        spanB: NaN,
      };

      // spanA and spanB projection
      this.result[index + this.basePeriod] = {
        conversion: NaN,
        base: NaN,
        spanA: spanA,
        spanB: spanB,
      };

      tick = yield;
      index += 1;
    }
  }

  override nextValue(tick: IchimokuTick): IchimokuOutput {
    this.generator.next(tick);

    const val = this.result.at(-1);
    if (val === undefined) {
      return { conversion: NaN, base: NaN, spanA: NaN, spanB: NaN };
    }

    return {
      conversion: val.conversion ? this.format(val.conversion) : NaN,
      base: val.base ? this.format(val.base) : NaN,
      spanA: val.spanA ? this.format(val.spanA) : NaN,
      spanB: val.spanB ? this.format(val.spanB) : NaN,
    };
  }
}
