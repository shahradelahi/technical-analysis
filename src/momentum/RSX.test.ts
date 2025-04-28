import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { RSX, RSXInput } from './RSX';

const input: RSXInput = {
  values: SampleBars.close.slice(0, 30),
  period: 10,
  decimal: 6,
};

const expectedResult = [
  50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 91.244738, 85.502011, 69.4814, 55.478502,
  49.079842, 45.827076, 46.982069, 50.502628, 52.679827, 54.964018, 56.81331,
];

describe('Relative Strength Xtra (RSX)', function () {
  it('should calculate RSX and matched the expected', function () {
    const result = RSX.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
