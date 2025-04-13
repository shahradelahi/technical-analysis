import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { RSI, RSIInput } from './RSI';

const input: RSIInput = {
  values: SampleBars.close.slice(0, 30),
  decimal: 6,
};

const expectedResult = [
  86.387268, 86.414927, 89.652787, 86.471017, 84.927233, 80.520975, 77.503984, 58.003389, 57.979007,
  64.353105, 62.08506, 66.178352, 68.001092, 64.126468, 65.750235, 65.48184,
];

describe('Relative Strength Index (RSI)', function () {
  it('should calculate RSI and matched the expected', function () {
    const result = new RSI(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
