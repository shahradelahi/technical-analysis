import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { HA, HAInput } from './HA';

const input: HAInput = {
  open: SampleBars.open.slice(0, 30),
  high: SampleBars.high.slice(0, 30),
  low: SampleBars.low.slice(0, 30),
  close: SampleBars.close.slice(0, 30),
  decimal: 6,
};

const expectedResult = [
  { open: 123.3125, high: 130.0, low: 117.15, close: 123.44375 },
  { open: 123.378125, high: 135.475005, low: 123.378125, close: 130.125 },
  { open: 126.751563, high: 134.699995, low: 109.025, close: 126.13125 },
  { open: 126.441406, high: 147.899995, low: 125.875, close: 138.018746 },
  { open: 132.230076, high: 153.199995, low: 132.230076, close: 147.05625 },
  { open: 139.643163, high: 155.0, low: 131.649995, close: 143.643746 },
  { open: 141.643455, high: 151.875, low: 138.274995, close: 144.631249 },
  { open: 143.137352, high: 150.600005, low: 137.050005, close: 143.550004 },
  { open: 143.343678, high: 151.0, low: 132.375, close: 139.650001 },
  { open: 141.496839, high: 151.0, low: 128.574995, close: 141.525001 },
  { open: 141.51092, high: 168.875, low: 141.51092, close: 156.612499 },
  { open: 149.06171, high: 180.925005, low: 149.06171, close: 171.131249 },
  { open: 160.096479, high: 212.350005, low: 160.096479, close: 191.087505 },
  { open: 175.591992, high: 255.0, low: 175.591992, close: 218.006249 },
  { open: 196.79912, high: 248.949995, low: 196.79912, close: 230.98125 },
  { open: 213.890185, high: 255.0, low: 213.890185, close: 241.275001 },
  { open: 227.582593, high: 291.399995, low: 217.5, close: 260.093748 },
  { open: 243.83817, high: 302.95001, low: 243.83817, close: 284.212501 },
  { open: 264.025336, high: 310.0, low: 264.025336, close: 284.28125 },
  { open: 274.153293, high: 300.0, low: 252.625, close: 276.537499 },
  { open: 275.345396, high: 325.0, low: 261.100005, close: 279.706253 },
  { open: 277.525824, high: 316.524995, low: 190.850005, close: 246.443749 },
  { open: 261.984786, high: 261.984786, low: 204.574995, close: 216.506247 },
  { open: 239.245517, high: 245.25, low: 200.0, close: 227.349997 },
  { open: 233.297757, high: 277.5, low: 224.25, close: 245.893749 },
  { open: 239.595753, high: 259.875, low: 234.300005, close: 247.737503 },
  { open: 243.666628, high: 300.0, low: 243.666628, close: 271.118745 },
  { open: 257.392686, high: 293.5, low: 243.5, close: 265.368751 },
  { open: 261.380719, high: 273.95001, low: 236.050005, close: 259.587505 },
  { open: 260.484112, high: 275.0, low: 245.0, close: 263.962501 },
];

describe('Heikin Ashi Candles (HA)', function () {
  it('should calculate HA and matched the expected', function () {
    const result = HA.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
