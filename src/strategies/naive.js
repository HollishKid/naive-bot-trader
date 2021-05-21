'use strict'

/**
 * A Strategy receives a certain span of candles and returns a signal for the Trader.
 * Any strategy should define in their constructor:
 * - candlesAmount (amount of candles to receive)
 *
 * @param   {Object}  trader  A reference to the Trader class.
 * @returns {Promise}         Promise that resolves to `short`, `long` or `null`.
 */

class NaiveStrategy {
  constructor (trader) {
    this.trader = trader

    this.candlesAmount = 2
  }

  async run (currentSignal, data) {
    return new Promise((resolve, reject) => {
      if (data[0].close > data[1].close) {
        resolve({ signal: 'long', ta: null })
      } else if (data[0].close < data[1].close) {
        resolve({ signal: 'short', ta: null })
      }

      resolve({ signal: null, ta: null })
    })
  }
}

module.exports = NaiveStrategy
