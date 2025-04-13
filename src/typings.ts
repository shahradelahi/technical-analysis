export interface StockData {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  reversedInput?: boolean;
}

export interface CandleData {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  timestamp?: number;
  volume?: number;
}

export interface CandleList {
  open?: number[];
  high?: number[];
  low?: number[];
  close?: number[];
  volume?: number[];
  timestamp?: number[];
}
