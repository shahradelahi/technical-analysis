import { Indicator, IndicatorInput } from '@/indicator';
import { hlc3 } from '@/math/hlc3';
import { FixedSizeLinkedList } from '@/utils/FixedSizeLinkedList';

export interface MFIInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  period: number;
}

export type MFIOutput = number | undefined;

export interface MFITick {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Money Flow Index (MFI)
 */
export class MFI extends Indicator<MFIOutput, MFITick> {
  period: number;

  private readonly positiveFlow: FixedSizeLinkedList;
  private readonly negativeFlow: FixedSizeLinkedList;

  protected override result: number[] = [];
  protected override generator;

  constructor(input: MFIInput) {
    super(input);

    this.period = input.period;

    const period = input.period;

    this.positiveFlow = new FixedSizeLinkedList(period, false, false, true);
    this.negativeFlow = new FixedSizeLinkedList(period, false, false, true);

    this.generator = this.mfiGenerator();
    this.generator.next();

    input.high.forEach((high, index) => {
      this.nextValue({
        high,
        low: input.low[index]!,
        close: input.close[index]!,
        volume: input.volume[index]!,
      });
    });
  }

  private *mfiGenerator(): IterableIterator<MFIOutput, never, MFITick> {
    let result;
    let tick = yield;
    let positiveFlowForPeriod;
    let rawMoneyFlow = 0;
    let moneyFlowRatio;
    let negativeFlowForPeriod;
    let typicalPriceValue = null;
    let previousTypicalPrice = null;

    while (true) {
      const { high, low, close, volume } = tick;

      let positionMoney = 0,
        negativeMoney = 0;

      typicalPriceValue = hlc3(high, low, close);

      if (typicalPriceValue != null && previousTypicalPrice != null) {
        rawMoneyFlow = typicalPriceValue * volume;

        typicalPriceValue > previousTypicalPrice
          ? (positionMoney = rawMoneyFlow)
          : (negativeMoney = rawMoneyFlow);

        this.positiveFlow.push(positionMoney);
        this.negativeFlow.push(negativeMoney);

        positiveFlowForPeriod = this.positiveFlow.periodSum;
        negativeFlowForPeriod = this.negativeFlow.periodSum;

        if (this.positiveFlow.totalPushed + 1 >= this.period) {
          moneyFlowRatio = positiveFlowForPeriod / negativeFlowForPeriod;
          result = 100 - 100 / (1 + moneyFlowRatio);
        }
      }

      previousTypicalPrice = typicalPriceValue;
      tick = yield result;
    }
  }
}
