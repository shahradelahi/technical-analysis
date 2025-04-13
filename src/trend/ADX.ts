import { Indicator, IndicatorInput } from 'src/indicator';

import { RMA } from '@/overlap/RMA';
import { zero } from '@/utils/number';
import { ATR } from '@/volatility/ATR';

export interface ADXInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export interface ADXOutput {
  adx?: number;
  dmp?: number;
  dmn?: number;
}

export interface ADXTick {
  high: number;
  low: number;
  close: number;
}

/**
 * ### Average Directional Movement (ADX)
 *
 * The Average Directional Movement Index (ADX) is a technical indicator used to measure the strength of a trend,
 * regardless of its direction. It is derived from the Directional Movement Index (DMI), which consists of two
 * components: the Positive Directional Indicator (+DI) and the Negative Directional Indicator (-DI).
 *
 * **Key Concepts:**
 * - **Trend Strength:** ADX quantifies the strength of a trend, not its direction.
 * - **+DI and -DI:** These indicators measure the strength of upward and downward price movements, respectively.
 * - **ADX Calculation:** ADX is derived from the smoothed average of the difference between +DI and -DI.
 *
 * **Resources:**
 * - [Trading Technologies - Average Directional Movement (ADX)](https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/average-directional-movement-adx/)
 * - [Investopedia - Average Directional Index (ADX)](https://www.investopedia.com/terms/a/adx.asp)
 */
export class ADX extends Indicator<ADXOutput, ADXTick> {
  protected override result: ADXOutput[] = [];
  protected override generator;

  private readonly atr: ATR;
  private readonly emaPDM: RMA;
  private readonly emaMDM: RMA;
  private readonly emaDX: RMA;

  constructor(input: ADXInput) {
    super(input);

    this.emaPDM = new RMA({ period: input.period, values: [] });
    this.emaMDM = new RMA({ period: input.period, values: [] });
    this.emaDX = new RMA({ period: input.period, values: [] });

    this.atr = new ATR({ period: input.period, low: [], high: [], close: [] });

    this.generator = this.adxGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high: high,
        low: input.low[index]!,
        close: input.close[index]!,
      });
    });
  }

  private *adxGenerator(): IterableIterator<ADXOutput, never, ADXTick> {
    const scalar = 100;

    let tick = yield {};

    let prevHigh = tick.high,
      prevLow = tick.low;

    while (true) {
      const atr = this.atr.nextValue(tick);

      const hDiff = tick.high - prevHigh;
      const lDiff = prevLow - tick.low;

      const pos = zero(hDiff > lDiff && hDiff > 0 ? hDiff : 0);
      const neg = zero(lDiff > hDiff && lDiff > 0 ? lDiff : 0);

      const avgPDI = this.emaPDM.nextValue(pos);
      const avgNDI = this.emaMDM.nextValue(neg);

      prevHigh = tick.high;
      prevLow = tick.low;

      if (atr === undefined || avgPDI === undefined || avgNDI === undefined) {
        tick = yield {};
        continue;
      }

      const k = scalar / atr;
      const dmp = k * avgPDI;
      const dmn = k * avgNDI;

      const dx = (scalar * Math.abs(dmp - dmn)) / (dmp + dmn);
      const adx = this.emaDX.nextValue(dx) || NaN;

      tick = yield { adx, dmp, dmn };
    }
  }

  override nextValue(tick: ADXTick): ADXOutput {
    let val = this.generator.next(tick).value;
    if (!val) return {};

    val = {
      adx: val.adx ? this.format(val.adx) : undefined,
      dmp: val.dmp ? this.format(val.dmp) : undefined,
      dmn: val.dmn ? this.format(val.dmn) : undefined,
    } satisfies ADXOutput;

    this.result.push(val);

    return val;
  }
}
