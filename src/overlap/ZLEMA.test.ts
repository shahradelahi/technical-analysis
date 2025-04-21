import * as assert from 'assert';

import { SampleValues } from '@/samples';

import { ZLEMA, ZLEMAInput } from './ZLEMA';

const input = {
  values: SampleValues,
  period: 5,
  decimal: 6,
} satisfies ZLEMAInput;

const expectResult = [
  148.032, 145.548, 139.392, 146.111333, 159.964222, 176.176148, 196.867432, 219.528288, 241.722192,
  249.528128, 276.222085, 289.82139,
];

describe('Zero Lag Exponential Moving Average (ZLEMA)', function () {
  it('should calculate ZLEMA using the calculate method', function () {
    const result = ZLEMA.calculate(input);
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });
});
