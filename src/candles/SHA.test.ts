import * as assert from 'assert';

import { SampleBars } from '@/samples';

import { SHA, SHAInput } from './SHA';

const input: SHAInput = {
  open: SampleBars.open.slice(0, 30),
  high: SampleBars.high.slice(0, 30),
  low: SampleBars.low.slice(0, 30),
  close: SampleBars.close.slice(0, 30),
  decimal: 6,
};

const expectedResult = [
  { open: 134.137816, high: 146.074999, low: 127.558319, close: 137.7775 },
  { open: 135.47838, high: 150.220454, low: 130.095156, close: 141.202045 },
  { open: 137.948076, high: 155.8031, low: 133.54362, close: 146.643718 },
  { open: 141.975059, high: 166.084355, low: 138.371413, close: 154.724407 },
  { open: 148.087228, high: 182.250836, low: 145.138791, close: 166.230196 },
  { open: 156.943936, high: 194.377956, low: 154.531578, close: 178.003115 },
  { open: 167.2978, high: 205.400146, low: 165.324052, close: 189.507094 },
  { open: 178.258671, high: 221.036482, low: 174.810588, close: 202.341031 },
  { open: 190.182216, high: 235.929851, low: 187.361058, close: 217.226753 },
  { open: 203.608238, high: 249.397151, low: 201.300017, close: 229.41848 },
  { open: 216.434612, high: 258.597669, low: 210.631832, close: 237.985574 },
  { open: 227.145663, high: 270.67082, low: 219.807864, close: 245.571152 },
  { open: 236.305693, high: 279.007943, low: 214.542798, close: 245.729806 },
  { open: 240.974619, high: 275.912823, low: 212.730471, close: 240.416432 },
  { open: 240.660237, high: 270.337764, low: 210.41584, close: 238.040716 },
  { open: 239.321604, high: 271.639989, low: 212.931141, close: 239.46854 },
  { open: 239.371449, high: 269.5009, low: 216.816389, close: 240.971988 },
  { open: 240.152391, high: 275.046191, low: 221.698251, close: 246.453217 },
  { open: 243.28699, high: 278.401429, low: 225.662205, close: 249.892405 },
  { open: 246.576759, high: 277.59208, low: 227.550896, close: 251.65515 },
  { open: 249.105369, high: 277.120793, low: 230.72346, close: 253.89285 },
];

describe('Heikin Ashi Candles (SHA)', function () {
  it('should calculate SHA and matched the expected', function () {
    const result = SHA.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
