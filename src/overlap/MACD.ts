import { EMA } from 'src/overlap/EMA';
import { SMA } from 'src/overlap/SMA';

import { Indicator, IndicatorInput } from '@/indicator';

export interface MACDInput extends IndicatorInput {
  /**
   * Indicator to be used to generate the oscillator.
   * If true, SMA will be used, otherwise EMA will be used.
   * @default true
   */
  simpleMAOscillator: boolean;

  /**
   * Indicator to be used to generate the signal.
   * If true, SMA will be used, otherwise EMA will be used.
   * @default true
   */
  simpleMASignal: boolean;

  /**
   * Number of values to use to calculate the fast moving average.
   * @default 12
   */
  fastPeriod?: number;

  /**
   * Number of values to use to calculate the slow moving average.
   * @default 26
   */
  slowPeriod?: number;

  /**
   * Number of values to use to calculate the signal line.
   * @default 9
   */
  signalPeriod?: number;

  values: number[];
}

export interface MACDOutput {
  MACD?: number;
  signal?: number;
  histogram?: number;
}

export type MACDTick = number;

/**
 * Moving Average Convergence Divergence (MACD)
 */
export class MACD extends Indicator<MACDOutput, MACDTick> {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  values: number[];

  result: MACDOutput[] = [];
  generator;

  fastMAProducer: SMA | EMA;
  slowMAProducer: SMA | EMA;
  signalMAProducer: SMA | EMA;

  constructor(input: MACDInput) {
    super(input);

    this.fastPeriod = input.fastPeriod || 12;
    this.slowPeriod = input.slowPeriod || 26;
    this.signalPeriod = input.signalPeriod || 9;
    this.values = input.values;

    const OscillatorMA = input.simpleMAOscillator ? SMA : EMA;
    const SignalMA = input.simpleMASignal ? SMA : EMA;

    this.fastMAProducer = new OscillatorMA({
      period: this.fastPeriod,
      values: [],
    });

    this.slowMAProducer = new OscillatorMA({
      period: this.slowPeriod,
      values: [],
    });

    this.signalMAProducer = new SignalMA({
      period: this.signalPeriod,
      values: [],
    });

    this.generator = this.macdGenerator();
    this.generator.next();

    this.values.forEach((tick) => {
      this.nextValue(tick);
    });
  }

  private *macdGenerator(): IterableIterator<MACDOutput, never, MACDTick> {
    let tick, MACD, signal, histogram, fast, slow;

    while (true) {
      if (fast && slow) {
        MACD = fast - slow;
        signal = this.signalMAProducer.nextValue(MACD)!;
        histogram = MACD - signal;
      }

      tick = yield { MACD, signal, histogram };
      fast = this.fastMAProducer.nextValue(tick);
      slow = this.slowMAProducer.nextValue(tick);
    }
  }

  override nextValue(tick: number) {
    let val = this.generator.next(tick).value as MACDOutput | undefined;
    if (!val) return;

    val = {
      MACD: val.MACD ? this.format(val.MACD) : undefined,
      signal: val.signal ? this.format(val.signal) : undefined,
      histogram: val.histogram ? this.format(val.histogram) : undefined,
    };
    this.result.push(val);

    return val;
  }
}
