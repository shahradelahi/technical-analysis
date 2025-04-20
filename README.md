# @se-oss/ta

[![CI](https://github.com/shahradelahi/technical-analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/shahradelahi/technical-analysis/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/ta.svg)](https://www.npmjs.com/package/@se-oss/ta)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/ta)](https://packagephobia.com/result?p=@se-oss/ta)
![Edge Runtime Compatible](https://img.shields.io/badge/edge--runtime-%E2%9C%94%20compatible-black)

A lightweight JavaScript library that delivers a comprehensive suite of technical and candlestick indicators, plus essential utilities, to streamline financial analysis and charting.

---

- [Installation](#-installation)
- [API](#-api)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm i @se-oss/ta
```

## 📑 API

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/ta).

#### Indicators

###### Momentum

- [Awesome Oscillator (AO)](src/momentum/AO.ts)
- [Momentum (MOM)](src/momentum/MOM.ts)
- [Rate of Change (ROC)](src/momentum/ROC.ts)
- [Relative Strength Index (RSI)](src/momentum/RSI.ts)
- [Stochastic Oscillator (STOCH)](src/momentum/Stochastic.ts)
- [Stochastic RSI Oscillator (STOCHRSI)](src/momentum/StochasticRSI.ts)

###### Overlap

- [Exponential Moving Average (EMA)](src/overlap/EMA.ts)
- [Ichimoku Kinkō Hyō (Ichimoku)](src/overlap/Ichimoku.ts)
- [Moving Average Convergence Divergence (MACD)](src/overlap/MACD.ts)
- [Rolling Moving Average (RollingMA)](src/overlap/RollingMA.ts)
- [Simple Moving Average (SMA)](src/overlap/SMA.ts)
- [Smoothed Moving Average (SMMA)](src/overlap/SMMA.ts)
- [Volume Weighted Average Price (VWAP)](src/overlap/VWAP.ts)
- [Weighted Moving Average (WMA)](src/overlap/WMA.ts)
- [Welles WildeR's Moving Average (RMA)](src/overlap/RMA.ts)
- [Zero Lag Exponential Moving Average (ZLEMA)](src/overlap/ZLEMA.ts)

###### Trend

- [Average Directional Movement (ADX)](src/trend/ADX.ts)
- [Parabolic Stop and Reverse (PSAR)](src/trend/PSAR.ts)

###### Volatility

- [Average True Range (ATR)](src/volatility/ATR.ts)
- [True Range](src/volatility/TrueRange.ts)

###### Volume

- [Money Flow Index (MFI)](src/volume/MFI.ts)

#### Candles

- [Heikin Ashi Candles (HA)](src/candles/HA.ts)
- [Smoothed Heikin Ashi Candles (SHA)](src/candles/SHA.ts)

#### Utils

- Fibonacci Retracement
- Typical Price (HLC3)

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/technical-analysis).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/technical-analysis/graphs/contributors).
