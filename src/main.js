'use strict'

const Backtester = require('./backtester')
const Processor = require('./processor')
const Signaller = require('./signaller')
const Trader = require('./trader')

const args = process.argv.slice(2)
const tradingType = args[0]

let processor = null
let signaller = null
let trader = null
let gatherer = null
let charter = null

switch (tradingType) {
  case 'backtest':
    console.info('Starting a backtest...')
    const dataset = args[1]
    const strategy = args[2]

    signaller = new Signaller(strategy)
    processor = new Processor(signaller.strategy.candlesAmount)
    trader = new Trader('backtest')
    const backTester = new Backtester(dataset, newData, doneBacktesting)
    break
  case 'paper':
    console.info('Starting paper trading...')
    console.info('Currently not implemented.')
    break
  case 'live':
    console.info('Starting live trading...')
    console.info('Currently not implemented.')
    break
  default:
    console.error('Incorrect arguments.')
    process.exit(1)
}

async function newData(candle) {
  try {
    const relevantData = await processor.newData(candle)
    await newRelevantData(relevantData)
  } catch (error) {
    if (error.code > 0) {
      console.error(error.message)
      process.exit(1)
    } else {
      console.info(error.message)
    }
  }
}

async function newRelevantData(relevantData) {
  try {
    const newSignal = await signaller.newRelevantData(relevantData)
    if (newSignal) {
      tradeSignal(newSignal)
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function tradeSignal(signal) {
  try {
    await trader.run(signal)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function doneBacktesting() {
  console.log(trader.accounts)
  console.log(trader.paidFees)
}
