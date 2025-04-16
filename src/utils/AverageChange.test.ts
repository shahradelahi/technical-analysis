import * as assert from 'assert';

import { AverageChange, AverageChangeInput } from '@/utils/AverageChange';

describe('Average Change', () => {
  describe('Average Gain', function () {
    const input: AverageChangeInput = {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      period: 6,
      positive: true,
    };

    it('should calculate average gain when values are increasing', function () {
      const result = new AverageChange(input).getResult();
      assert.deepEqual(result, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });

    it('should calculate average gain when values are decreasing', function () {
      const avg = new AverageChange({ ...input, values: input.values.reverse() });

      const result = avg.getResult();
      const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      assert.deepEqual(result, expected);
    });
  });

  describe('Average Loss', function () {
    const input: AverageChangeInput = {
      values: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      period: 6,
      positive: false,
    };

    it('should calculate average loss when values are decreasing', function () {
      const result = new AverageChange(input).getResult();
      assert.deepEqual(result, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });

    it('should calculate average loss when values are increasing', function () {
      const avg = new AverageChange({ ...input, values: input.values.reverse() });

      const result = avg.getResult();
      const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      assert.deepEqual(result, expected);
    });
  });
});
