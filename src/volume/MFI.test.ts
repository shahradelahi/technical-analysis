import * as assert from 'node:assert';

import { MFI, MFIInput } from './MFI';

const input = {
  high: [
    24.61, 24.69, 24.99, 25.36, 25.19, 25.17, 25.0, 24.97, 25.08, 25.26, 25.21, 25.37, 25.61, 25.58,
    25.46, 25.33, 25.09, 25.03, 24.91, 24.89, 25.13,
  ],
  low: [
    24.64, 24.69, 24.99, 25.36, 25.19, 25.17, 25.01, 24.96, 25.08, 25.25, 25.21, 25.37, 25.61,
    25.58, 25.46, 25.33, 25.09, 25.03, 24.91, 24.89, 25.13,
  ],
  close: [
    24.63, 24.69, 24.99, 25.36, 25.19, 25.17, 25.02, 24.95, 25.08, 25.24, 25.21, 25.37, 25.61,
    25.58, 25.46, 25.33, 25.09, 25.03, 24.91, 24.89, 25.13,
  ],
  volume: [
    18730, 12272, 24691, 18358, 22964, 15919, 16067, 16568, 16019, 9774, 22573, 12987, 10907, 5799,
    7395, 5818, 7165, 5673, 5625, 5023, 7457,
  ],
  period: 14,
  decimal: 6,
} satisfies MFIInput;

const expectResult = [
  51.270839, 49.464204, 45.107268, 36.269998, 28.404025, 31.525806, 33.866526, 41.299341,
];

describe('Money Flow Index (MFI)', function () {
  it('should calculate MFI using the calculate method', function () {
    const result = new MFI(input).getResult();
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });

  it('should be able to calculate MFI by using getResult', function () {
    const mfi = new MFI(input);
    assert.deepEqual(mfi.getResult(), expectResult, 'Wrong Results while calculating next bar');
  });

  it('should be able to get MFI for the next bar using nextValue', function () {
    const mfi = new MFI({ ...input, high: [], low: [], close: [], volume: [] });
    const results: number[] = [];

    input.close.forEach(function (_close, index) {
      const result = mfi.nextValue({
        close: input.close[index]!,
        high: input.high[index]!,
        low: input.low[index]!,
        volume: input.volume[index]!,
      });
      if (result !== undefined) {
        results.push(result);
      }
    });

    assert.deepEqual(results, expectResult, 'Wrong Results while getting results');
  });
});
