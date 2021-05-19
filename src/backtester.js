'use strict'

const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')

class Backtester {
  constructor (dataset, newData, doneBacktesting) {
    this.dataset = dataset
    this.newData = newData
    this.doneBacktesting = doneBacktesting

    this.data = null
  }

  async run () {
    this.data = await this.processFile(this.dataset)
    for (const candle of this.data) {
      await this.newData(candle)
    }

    this.doneBacktesting()
  }

  async processFile (dataset) {
    try {
      const candles = []
      const file = path.join(__dirname, `../historicalData/${dataset}.csv`)

      const parser = fs.createReadStream(file).pipe(parse({ cast: true, columns: true }))

      for await (const candle of parser) {
        if (
          candle.timestamp !== undefined &&
          candle.symbol !== undefined &&
          candle.open !== undefined &&
          candle.high !== undefined &&
          candle.low !== undefined &&
          candle.close !== undefined &&
          candle.volume !== undefined
        ) {
          candles.push(candle)
        } else {
          throw Error('Invalid candle format. A candle must contain timestamp, symbol and OHLVC data.')
        }
      }

      return candles
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}

module.exports = Backtester
