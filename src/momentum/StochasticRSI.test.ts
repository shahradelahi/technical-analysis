import * as assert from 'assert';

import { StochasticRSI, StochasticRSIInput, StochasticRSIOutput } from '@/momentum/StochasticRSI';
import { SampleValues } from '@/samples';

const input: StochasticRSIInput = {
  values: SampleValues,
  period: 5,
  rsiPeriod: 5,
  kPeriod: 3,
  dPeriod: 3,
  decimal: 6,
};

const expectedResult: StochasticRSIOutput[] = [
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: undefined, k: undefined, d: undefined },
  { stochRSI: 73.442915, k: undefined, d: undefined },
  { stochRSI: 100.0, k: undefined, d: undefined },
  { stochRSI: 100.0, k: 91.147638, d: undefined },
  { stochRSI: 100.0, k: 100.0, d: undefined },
  { stochRSI: 100.0, k: 100.0, d: 97.049213 },
  { stochRSI: 100.0, k: 100.0, d: 100.0 },
  { stochRSI: 100.0, k: 100.0, d: 100.0 },
  { stochRSI: 100.0, k: 100.0, d: 100.0 },
  { stochRSI: 0.0, k: 66.666667, d: 88.888889 },
];

describe('Stochastic RSI Oscillator (STOCHRSI)', function () {
  it('should calculate STOCHRSI and matched the expected', function () {
    const result = new StochasticRSI(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
