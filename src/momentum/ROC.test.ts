import * as assert from 'assert';

import { SampleValues } from '@/samples';

import { ROC, ROCInput } from './ROC';

const input: ROCInput = {
  values: SampleValues,
  period: 5,
  decimal: 6,
};

const expectedResult = [
  7.64775, 14.230352, 4.745763, -5.618982, 0.214794, 18.128272, 21.420817, 44.084862, 61.699337,
  62.913597, 49.904586, 60.055882, 39.890192,
];

describe('Rate of Change (ROC)', function () {
  it('should calculate ROC and matched the expected', function () {
    const result = new ROC(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
