import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { WILLR, WILLRInput } from './WILLR';

const input: WILLRInput = {
  high: SampleBars.high.slice(0, 30),
  low: SampleBars.low.slice(0, 30),
  close: SampleBars.close.slice(0, 30),
  period: 10,
  decimal: 6,
};

const expectedResult = [
  -12.398032, -10.73518, -2.746884, -13.876842, -26.181533, -9.313818, -9.076531, -3.055431,
  -13.003592, -17.996414, -24.92776, -37.81178, -71.866846, -82.128221, -60.044732, -64.983234,
  -49.235924, -41.520695, -49.552745, -43.346998, -43.868809,
];

describe("William's Percent R (WILLR)", function () {
  it('should calculate WILLR and matched the expected', function () {
    const result = WILLR.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
