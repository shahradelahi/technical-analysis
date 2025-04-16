import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { PSAR, PSARInput } from './PSAR';

const input: PSARInput = {
  high: SampleBars.high.slice(0, 30),
  low: SampleBars.low.slice(0, 30),
  close: SampleBars.close.slice(0, 30),
  acceleration: 0.02,
  max: 0.2,
  decimal: 6,
};

const expectedResult = [
  135.475005, 135.475005, 109.025, 109.025, 110.792, 113.44448, 115.937811, 118.281542, 120.48465,
  122.555571, 126.261125, 131.727513, 141.402212, 157.305902, 170.983076, 182.745445, 200.130173,
  217.5, 236.0, 250.8, 325.0, 325.0, 322.317, 319.68766, 317.110907, 314.585689, 312.110975,
  309.685756, 307.309041,
];

describe('Parabolic Stop and Reverse (PSAR)', function () {
  it('should calculate PSAR and matched the expected', function () {
    const result = new PSAR(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
