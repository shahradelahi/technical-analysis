import * as assert from 'assert';

import { AverageGain, AverageGainInput } from './AverageGain';

const input: AverageGainInput = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  period: 6,
};

describe('Average Gain', function () {
  it('should calculate average gain when values are increasing', function () {
    const result = new AverageGain(input).getResult();
    assert.deepEqual(result, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('should calculate average gain when values are decreasing', function () {
    const avg = new AverageGain({ ...input, values: input.values.reverse() });

    const result = avg.getResult();
    const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    assert.deepEqual(result, expected);
  });
});
