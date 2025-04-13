import * as assert from 'node:assert';

import { Lowest, LowestInput } from './Lowest';

const input: LowestInput = {
  values: [10, 20, 30, 40, 30, 20, 10, 20, 16, 29, 15],
  period: 3,
};

const expectResult = [10, 20, 30, 20, 10, 10, 10, 16, 15];

describe('Lowest', function () {
  it('should calculate Lowest using the calculate method', function () {
    const result = new Lowest(input).getResult();
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });
});
