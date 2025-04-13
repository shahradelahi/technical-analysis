import * as assert from 'assert';

import { MidPrice, MidPriceInput } from '@/overlap/MidPrice';
import { SampleBars } from '@/samples';

const input: MidPriceInput = {
  high: SampleBars.high.slice(0, 20),
  low: SampleBars.low.slice(0, 20),
  period: 5,
  decimal: 6,
};

const expectedResult = [
  131.112498, 132.0125, 132.0125, 140.4375, 143.324997, 141.787498, 148.724998, 154.75, 170.4625,
  191.787498, 200.3125, 208.3125, 231.6, 249.475005, 260.625, 263.75,
];

describe('MidPrice', function () {
  it('should calculate MidPrice and matched the expected', function () {
    const result = new MidPrice(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
