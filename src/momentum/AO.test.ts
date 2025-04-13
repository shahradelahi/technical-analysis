import * as assert from 'assert';
import { AO, AOInput } from 'src/momentum/AO';

import { SampleBars } from '@/samples';

const input: AOInput = {
  high: SampleBars.high.slice(0, 50),
  low: SampleBars.low.slice(0, 50),
  decimal: 6,
};

const expectedResult = [
  57.290293, 60.252719, 64.120734, 73.917131, 89.984998, 106.630882, 118.940367, 130.834998,
  125.617351, 111.875291, 103.14301, 106.665217, 111.644924, 121.281837, 144.585661, 165.061692,
  176.347133,
];

describe('Awesome Oscillator (AO)', function () {
  it('should calculate AO and matched the expected', function () {
    const result = new AO(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
