import * as assert from 'node:assert';

import { SampleBars } from '@/samples';

import { ATR, ATRInput } from './ATR';

const input: ATRInput = {
  high: SampleBars.high.slice(0, 20),
  low: SampleBars.low.slice(0, 20),
  close: SampleBars.close.slice(0, 20),
  period: 5,
  decimal: 6,
};

const expectedResult = [
  18.524998, 17.689999, 16.862, 17.2146, 18.256681, 19.255345, 19.264277, 23.521421, 30.617137,
  32.033709, 32.006966, 40.385572, 40.173459, 40.238768, 41.666014,
];

describe('Average True Range (ATR)', () => {
  it('should calculate ATR using the calculate method', function () {
    const result = new ATR(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
