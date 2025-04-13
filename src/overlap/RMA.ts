import { Indicator } from '@/indicator';
import { SMA, SMAInput, SMAOutput } from '@/overlap/SMA';

export type RMAInput = SMAInput;
export type RMAOutput = SMAOutput;
export type RMATick = number;

/**
 * Welles WildeR's Moving Average (RMA)
 *
 * The WildeR's Moving Average is a type of exponential moving average (EMA) that uses a modified
 * smoothing factor alpha = 1/length. It was developed by J. Welles Wilder and is commonly used
 * in technical indicators like RSI and ADX.
 *
 * Formula:
 * RMA = ((previous RMA * (n-1)) + current_price) / n
 * where n is the period length
 *
 * Sources:
 * - https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}rma
 * - https://tlc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/V-Z/WildersSmoothing
 * - https://www.incrediblecharts.com/indicators/wilder_moving_average.php
 */
export class RMA extends Indicator<RMAOutput, RMATick> {
  alpha: number;
  period: number;

  private readonly sma: SMA;

  protected override result: RMAOutput[] = [];
  protected override generator;

  constructor(input: RMAInput) {
    super(input);

    this.period = input.period;
    this.alpha = 1 / this.period;

    this.sma = new SMA({ period: input.period, values: [] });

    this.generator = this.rmaGenerator();
    this.generator.next();

    input.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *rmaGenerator(): IterableIterator<RMAOutput, never, RMATick> {
    let index = 0;
    let tick = yield;
    let prev;
    while (true) {
      if (index < this.period) {
        prev = this.sma.nextValue(tick);
        tick = yield prev;
      } else if (index === this.period) {
        prev = (tick - prev!) * this.alpha + prev!;
        tick = yield prev;
      } else {
        prev = (tick - prev!) * this.alpha + prev!;
        tick = yield prev;
      }
      index++;
    }
  }
}
