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
 *  - https://www.tradingview.com/support/solutions/43000589152-ichimoku-cloud/
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

  private *ichimokuGenerator(): IterableIterator<IchimokuOutput, never, IchimokuTick> {
    let index = 0;
    let tick = yield { conversion: undefined, base: undefined, spanA: undefined, spanB: undefined };

    while (true) {
      // Feed tenkanSen, kijunSen and spanB with current tick
      const midPriceTick: MidPriceTick = { high: tick.high, low: tick.low };
      const tenkanSen = this.tenkanSen.nextValue(midPriceTick);
      const kijunSen = this.kijunSen.nextValue(midPriceTick);

      const spanA = tenkanSen && kijunSen ? (tenkanSen + kijunSen) / 2 : undefined;
      const spanB = this.spanB.nextValue(midPriceTick);

      // Calculate and return Ichimoku output
      const current = this.result[index];
      this.result[index] = {
        conversion: tenkanSen || undefined,
        base: kijunSen || undefined,
        spanA: current?.spanA || undefined,
        spanB: current?.spanB || undefined,
      };

      // spanA and spanB projection
      this.result[index + this.basePeriod - 1] = {
        conversion: undefined,
        base: undefined,
        spanA: spanA,
        spanB: spanB,
      };

      tick = yield this.result[index]!;
      index += 1;
    }
  }

  override nextValue(tick: IchimokuTick): IchimokuOutput {
    const val = this.generator.next(tick).value;
    return {
      conversion: val.conversion !== undefined ? this.format(val.conversion) : undefined,
      base: val.base !== undefined ? this.format(val.base) : undefined,
      spanA: val.spanA !== undefined ? this.format(val.spanA) : undefined,
      spanB: val.spanB !== undefined ? this.format(val.spanB) : undefined,
    };
  }

  static calculate(input: IchimokuInput): IchimokuOutput[] {
    return new Ichimoku(input).getResult();
  }
}
