import { Indicator, IndicatorInput } from '@/indicator';
import { AverageChange } from '@/utils/AverageChange';

export interface RSIInput extends IndicatorInput {
  values: number[];

  /**
   * It's period.
   * @default 14
   */
  period?: number;
}

export type RSIOutput = number | undefined;

export type RSITick = number;

/**
 * Relative Strength Index (RSI)
 *
 * Type: Momentum
 *
 * The Relative Strength Index (RSI) is a momentum indicator that measures the magnitude of recent price
 * changes to evaluate overbought or oversold conditions in the price of a stock or other asset.
 *
 * Sources:
 *  - https://www.tradingview.com/wiki/Relative_Strength_Index_(RSI)
 */
export class RSI extends Indicator<RSIOutput, RSITick> {
  values: number[];
  period: number;

  private readonly avgGain: AverageChange;
  private readonly avgLoss: AverageChange;

  protected override result: RSIOutput[] = [];
  protected override generator;

  constructor(input: RSIInput) {
    super(input);

    this.period = input.period || 14;
    this.values = input.values;

    this.avgGain = new AverageChange({ period: this.period, values: [], positive: true });
    this.avgLoss = new AverageChange({ period: this.period, values: [], positive: false });

    this.generator = this.rsiGenerator();
    this.generator.next();

    this.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *rsiGenerator(): IterableIterator<RSIOutput, never, RSITick> {
    let tick = yield;
    let lastAvgGain, lastAvgLoss, currentRSI;

    while (true) {
      lastAvgGain = this.avgGain.nextValue(tick);
      lastAvgLoss = this.avgLoss.nextValue(tick);

      if (lastAvgGain !== undefined && lastAvgLoss !== undefined) {
        if (lastAvgLoss === 0) {
          currentRSI = 100;
        } else if (lastAvgGain === 0) {
          currentRSI = 0;
        } else {
          currentRSI = 100 - 100 / (1 + lastAvgGain / lastAvgLoss);
        }
      }

      tick = yield currentRSI;
    }
  }
}
