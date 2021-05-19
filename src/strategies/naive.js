'use strict'

/**
 * A Strategy receives a certain span of candles and returns a signal for the Trader.
 * Any strategy should define in their constructor:
 * - candlesAmount (amount of candles to receive)
 * 
 * @param   {Array} candleSpan  Array of most recent candles.
 * @returns {Promise}           Promise that resolves to `short`, `long` or `null`.
 */

class NaiveStrategy {
  constructor() {
    this.candlesAmount = 2
  }

  async run(data) {
    return new Promise((resolve, reject) => {
      if (data[0].close > data[1].close) {
        resolve('long')
      } else if (data[0].close < data[1].close) {
        resolve('short')
      }

      resolve(null)
    })
  }
}

module.exports = NaiveStrategy
