[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Naive Bot Trader

This program is particularly naive at trading cryptocurrency.
It aims to wrap the [crypto.com Exchange](https://exchange-docs.crypto.com/spot/index.html) and make trades based on user-defined strategies. Its different components are detailed [here](docs/components.md).

## Philosophy

The naive bot will attempt to trade between a currency and a stablecoin (i.e. USDT). This is specifically the case when backtesting, where the naive bot is given X USDT. It is therefore recommended to backtest on data for a currency and USDT.

The naive bot will apply the most pessimistic trading fees, which are `0.4%` for both maker and taker at the time of writing.

## Prerequisites

When running backtests, please make sure that:
- Candle data is expressed in csv, containing `timestamp`, `symbol` and traditionnal `OHLCV` columns.
- Rows are ordered by increasing timestamp (oldest first, newest latest).
- `timestamp` are expressed in milliseconds.
- Candles are 1 minute long.
