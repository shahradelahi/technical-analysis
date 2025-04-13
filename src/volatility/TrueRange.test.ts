import * as assert from 'node:assert';

import { SampleBars } from '@/samples';

import { TrueRange, TrueRangeInput } from './TrueRange';

const input: TrueRangeInput = {
  high: SampleBars.high.slice(0, 20),
  low: SampleBars.low.slice(0, 20),
  close: SampleBars.close.slice(0, 20),
  decimal: 6,
};

const expectedResult = [
  9.475005, 25.674995, 22.024995, 12.09999, 23.350005, 14.350005, 13.55, 18.625, 22.425005, 23.25,
  19.300005, 40.55, 59.0, 37.699995, 31.899995, 73.899995, 39.32501, 40.5, 47.375,
];

describe('TrueRange', () => {
  it('should calculate TrueRange using the calculate method', function () {
    const result = new TrueRange(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
