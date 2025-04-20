import * as assert from 'assert';

import { SampleValues } from '@/samples';

import { SMMA, SMMAInput } from './SMMA';

const input = {
  values: SampleValues,
  period: 5,
  decimal: 6,
} satisfies SMMAInput;

const expectResult = [
  136.78, 136.928, 139.0184, 139.02472, 138.665776, 140.792621, 145.124097, 151.889277, 161.581422,
  173.645137, 187.56211, 198.753688, 216.28695, 229.08356,
];

describe('Smoothed Moving Average (SMMA)', function () {
  it('should calculate SMMA using the calculate method', function () {
    const result = SMMA.calculate(input);
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });
});
