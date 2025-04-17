import * as assert from 'assert';

import { Stochastic, StochasticInput } from '@/momentum/Stochastic';
import { SampleBars } from '@/samples';

const input: StochasticInput = {
  high: SampleBars.high.slice(0, 20),
  low: SampleBars.low.slice(0, 20),
  close: SampleBars.close.slice(0, 20),
};

const expectedResult = [
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: undefined, d: undefined },
  { k: 87.13249871553347, d: undefined },
  { k: 93.68900792754455, d: undefined },
  { k: 92.0432927929935, d: 90.95493314535717 },
  { k: 88.66480096515846, d: 91.46570056189883 },
  { k: 82.1383006318223, d: 87.61546479665809 },
];

describe('Stochastic (STOCH)', function () {
  it('should calculate STOCH and matched the expected', function () {
    const result = new Stochastic(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
