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
    trader = new Trader('backtest')
    signaller = new Signaller(trader, args[2])
    processor = new Processor(signaller.strategy.candlesAmount)
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
    await newRelevantData(relevantData)
    if (args[3] === 'true') {
      chart.newData(candle)
    }
  } catch (error) {
    if (error.code > 0) {
      console.error(error.message)
      process.exit(1)
    } if (error.code === 1) {
      console.info(error.message)
    } else {
      console.error(error)
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

async function doneBacktesting (firstCandle, lastCandle) {
  let strategyResult = 0
  console.log('======== Backtest Result ========')
  console.log(`Number of trades: ${trader.tradeAmount}`)
  console.log(`Total fees: ${parseFloat(Number.parseFloat(trader.paidFees).toFixed(2))} STABLECOIN`)
  console.log(`Market: ${parseFloat(Number.parseFloat((lastCandle.close - firstCandle.close) / 100).toFixed(2))}%`)
  Object.keys(trader.accounts).map((account) => {
    if (account === 'USDT') {
      strategyResult += trader.accounts[account]
    } else if (account === 'COIN') {
      strategyResult += parseFloat(Number.parseFloat((trader.accounts[account] * lastCandle.close)).toFixed(8))
    }
  })
  console.log(strategyResult)
  console.log(`Strategy: ${parseFloat(Number.parseFloat((strategyResult - trader.firstStableAmount) / 100).toFixed(2))}%`)
  console.log('Current accounts:')
  Object.keys(trader.accounts).map((account) => {
    console.log(`${account}: ${trader.accounts[account]}`)
  })
}
