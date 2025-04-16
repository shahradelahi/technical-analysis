import { Indicator, IndicatorInput } from '@/indicator';
import { zero } from '@/utils/number';

export interface PSARInput extends IndicatorInput {
  high: number[];
  low: number[];
  close?: number[];

  /**
   * Initial Acceleration Factor.
   * @default 0.02
   */
  start?: number;

  /**
   * Acceleration Factor.
   * @default 0.02
   */
  acceleration?: number;

  /**
   * Acceleration Factor.
   * @default 0.02
   */
  max?: number;
}

export type PSAROutput = number | undefined;

export interface PSARTick {
  high: number;
  low: number;
  close?: number;
}

/**
 * ### Parabolic Stop and Reverse (PSAR)
 *
 * The Parabolic Stop and Reverse (PSAR) indicator, developed by J. Welles Wilder, is used to determine the trend direction and potential reversals in price.
 * PSAR uses a trailing stop and reverse method called "SAR" (Stop and Reverse) to identify possible entries and exits. It is also known as SAR.
 *
 * #### How it Works
 * The PSAR indicator typically appears on a chart as a series of dots, either above or below an asset's price, depending on the direction the price is moving.
 *
 * -   **Uptrend:** A dot is placed below the price.
 * -   **Downtrend:** A dot is placed above the price.
 *
 * #### Key Concepts
 * - **SAR (Stop and Reverse):** The core concept of PSAR, where the indicator suggests reversing the current position when the price crosses the SAR value.
 * - **Trailing Stop:** The SAR value acts as a trailing stop, moving closer to the price as the trend progresses.
 * - **Acceleration Factor:** The indicator uses an acceleration factor to increase sensitivity as the trend strengthens.
 *
 * Sources:
 * - https://www.tradingview.com/pine-script-reference/#fun_sar
 * - https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=66&Name=Parabolic
 */
export class PSAR extends Indicator<PSAROutput, PSARTick> {
  start: number;
  accel: number;
  max: number;

  protected override result: PSAROutput[] = [];
  protected override generator;

  constructor(input: PSARInput) {
    super(input);

    this.start = input.start ?? 0.02;
    this.accel = input.acceleration ?? 0.02;
    this.max = input.max ?? 0.2;

    this.generator = this.psarGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close?.at(index),
      });
    });
  }

  private *psarGenerator(): IterableIterator<PSAROutput, never, PSARTick> {
    let ep, sar;

    let accel = this.accel;
    let prev = yield;
    let curr = yield;

    let window = [prev, curr];

    const up = curr.high - prev.high;
    const dn = prev.low - curr.low;
    const _dmn = zero(dn > up && dn > 0 ? dn : 0);
    let falling = _dmn > 0;

    if (falling) {
      sar = prev.high;
      ep = prev.low;
    } else {
      sar = prev.low;
      ep = prev.high;
    }

    if (prev.close) {
      sar = prev.close;
    }

    while (true) {
      // Check for a potential reversal:
      let reverse;
      let _sar;
      if (falling) {
        _sar = sar + accel * (ep - sar);
        reverse = curr.high > _sar;
        if (curr.low < ep) {
          ep = curr.low;
          accel = Math.min(accel + this.start, this.max);
        }
        _sar = Math.max(prev.high, window.at(0)?.high ?? prev.high, _sar);
      } else {
        _sar = sar + accel * (ep - sar);
        reverse = curr.low < _sar;
        if (curr.high > ep) {
          ep = curr.high;
          accel = Math.min(accel + this.start, this.max);
        }
        _sar = Math.min(prev.low, window.at(0)?.low ?? prev.low, _sar);
      }

      if (reverse) {
        _sar = ep;
        accel = this.start;
        falling = !falling;
        ep = falling ? curr.low : curr.high;
      }

      // Update SAR
      sar = _sar;

      prev = curr;
      curr = yield sar;

      // Update window
      window.push(curr);
      window = window.slice(-3);
    }
  }
}
