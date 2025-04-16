import { toFixed, toPrecision } from '@/utils/number';

export interface IndicatorInput {
  formatter?: NumberFormatterFn;
  precision?: number;
  decimal?: number;
}

export type NumberFormatterFn = (data: number) => number;

export abstract class Indicator<Output = number | undefined, Tick = number> {
  protected abstract generator: IterableIterator<Output, never, Tick>;
  protected abstract result: Output[];

  formatter?: NumberFormatterFn;
  precision?: number;
  decimal?: number;

  constructor(input: IndicatorInput) {
    this.formatter = input.formatter;
    this.precision = input.precision;
    this.decimal = input.decimal;
  }

  protected format(value: number): number {
    if (this.precision !== undefined) value = toPrecision(value, this.precision);
    if (this.decimal !== undefined) value = toFixed(value, this.decimal);

    return this.formatter ? this.formatter(value) : value;
  }

  getResult(): Output[] {
    return this.result;
  }

  setResult(value: Output[]): void {
    this.result = value;
  }

  nextValue(tick: Tick): Output | undefined {
    let val = this.generator.next(tick).value;
    if (val === undefined) return;

    if (typeof val === 'number') val = this.format(val) as Output;
    else {
      // TODO: throw an error or waring that value was not formatted
    }

    this.result.push(val);

    return val;
  }
}
