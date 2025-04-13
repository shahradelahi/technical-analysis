import * as assert from 'node:assert';

import { Highest, HighestInput } from './Highest';

const input: HighestInput = {
  values: [10, 20, 30, 40, 30, 20, 10, 20, 16, 29, 15],
  period: 3,
};

const expectResult = [30, 40, 40, 40, 30, 20, 20, 29, 29];

describe('Highest', function () {
  it('should calculate Highest using the calculate method', function () {
    const result = new Highest(input).getResult();
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });
});
