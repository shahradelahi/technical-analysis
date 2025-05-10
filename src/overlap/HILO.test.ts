import * as assert from 'node:assert';

import { SampleBars } from '@/samples';

import { HILO, HILOInput } from './HILO';

const input: HILOInput = {
  high: SampleBars.high.slice(0, 30),
  low: SampleBars.low.slice(0, 30),
  close: SampleBars.close.slice(0, 30),
  highPeriod: 6,
  lowPeriod: 12,
  decimal: 6,
};

const expectedResult = [
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: undefined, long: undefined, short: undefined },
  { line: 132.860416, long: 132.860416, short: undefined },
  { line: 137.414583, long: 137.414583, short: undefined },
  { line: 143.247917, long: 143.247917, short: undefined },
  { line: 151.766667, long: 151.766667, short: undefined },
  { line: 159.86875, long: 159.86875, short: undefined },
  { line: 166.235417, long: 166.235417, short: undefined },
  { line: 177.233334, long: 177.233334, short: undefined },
  { line: 188.168751, long: 188.168751, short: undefined },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
  { line: 188.168751, long: 188.168751, short: 188.168751 },
];

describe('Gann HiLo Activator (HiLo)', function () {
  it('should calculate HILO using the calculate method', function () {
    const result = HILO.calculate(input);

    assert.equal(result.length, expectedResult.length, 'Wrong Results length');
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
