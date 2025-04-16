import * as assert from 'assert';

import { SampleValues } from '@/samples';

import { MOM, MOMInput } from './MOM';

const input: MOMInput = {
  values: SampleValues,
  period: 5,
  decimal: 6,
};

const expectedResult = [
  9.77, 18.36, 6.3, -8.17, 0.32, 24.93, 31.57, 61.3, 84.67, 93.93, 81.07, 107.47, 79.92,
];

describe('Momentum (MOM)', function () {
  it('should calculate MOM and matched the expected', function () {
    const result = new MOM(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
