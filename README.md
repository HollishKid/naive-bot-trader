[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Naive Bot Trader

This program is particularly naive at trading cryptocurrency.
It aims to wrap the [crypto.com Exchange](https://exchange-docs.crypto.com/spot/index.html) and make trades based on user-defined strategies (traders). Its different components are detailed below.

## Gatherer

The bot gathers spot data from the crypto.com API.

## Backtester

The backtesting capabilities of the bot allow to check a strategy againt historical data. This data is then streamed into the normal workflow of the bot as if it came from the gatherer.

## Processor

The processor is responsible for receiving data from the gatherer or backtester, formatting it correctly and sending the appropriate data to the rest of the workflow. The processor is also responsible for storing historical data. It also provides helper functions for the gatherer to know the state of current historical data.

## Signaller

The signaller is the trading strategy that is being used either for either of the ongoing trading sessions, be it backtesting, paper trading or live trading.
It takes the data from the processor and signals the actual trader with one of the three signals `short`, `long` or `none`.

## Trader

The trader is responsible for executing the action provided by the signaller. The trader will take into account various information before actually executing an action, such as current positions and trading fees.