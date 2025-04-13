import * as assert from 'node:assert';

import { SampleBars } from '@/samples';

import { VWAP, VWAPInput } from './VWAP';

const input: VWAPInput = {
  high: SampleBars.high.slice(0, 20),
  low: SampleBars.low.slice(0, 20),
  close: SampleBars.close.slice(0, 20),
  volume: SampleBars.volume.slice(0, 20),
  decimal: 6,
};

const expectedResult = [
  124.966667, 130.166667, 125.491665, 139.724997, 147.758335, 141.391663, 145.841665, 142.233338,
  140.200002, 142.958333, 158.983332, 173.833333, 194.833338, 224.299998, 234.475, 240.541667,
  265.108328, 282.283335, 285.616668, 273.883332,
];

describe('Volume Weighted Average Price (VWAP)', () => {
  it('should calculate VWAP using the calculate method', function () {
    const result = new VWAP(input).getResult();

    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
