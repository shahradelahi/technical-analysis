import * as assert from 'assert';

import { AverageLoss, AverageLossInput } from './AverageLoss';

const input: AverageLossInput = {
  values: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  period: 6,
};

describe('Average Loss', function () {
  it('should calculate average loss when values are decreasing', function () {
    const result = new AverageLoss(input).getResult();
    assert.deepEqual(result, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('should calculate average loss when values are increasing', function () {
    const avg = new AverageLoss({ ...input, values: input.values.reverse() });

    const result = avg.getResult();
    const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    assert.deepEqual(result, expected);
  });
});
