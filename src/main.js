'use strict'

const open = require('open')

const Backtester = require('./backtester')
const Processor = require('./processor')
const Signaller = require('./signaller')
const Trader = require('./trader')
const Server = require('./chart/server')

const args = process.argv.slice(2)
const tradingType = args[0]

let processor = null
let signaller = null
let trader = null
let backTester = null
let chart = null
// let gatherer = null
// let charter = null

switch (tradingType) {
  case 'backtest':
    console.info('Starting a backtest...')
    signaller = new Signaller(args[2])
    processor = new Processor(signaller.strategy.candlesAmount)
    trader = new Trader('backtest')
    backTester = new Backtester(args[1], newData, doneBacktesting)
    backTester.run()
    if (args[3] === 'true') {
      chart = new Server(backTester)
      open('http://localhost:3000')
    }
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

async function newData (candle) {
  try {
    const relevantData = await processor.newData(candle)
    chart.newData(candle)
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

async function newRelevantData (relevantData) {
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

async function tradeSignal (signal) {
  try {
    await trader.run(signal)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function doneBacktesting () {
  console.log(trader.accounts)
  console.log(trader.paidFees)
}
