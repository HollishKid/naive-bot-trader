'use strict'

/**
 * A Strategy receives a certain span of candles and returns a signal for the Trader.
 * Any strategy should define in their constructor:
 * - candlesAmount (amount of candles to receive)
 *
 * @param   {Object}  trader  A reference to the Trader class.
 * @returns {Promise}         Promise that resolves to `short`, `long` or `null`.
 */

class TechnichalAnalysis {
  constructor (trader) {
    this.trader = trader

    this.candlesAmount = 2
  }

  async run(currentSignal, data) {
    return new Promise((resolve, reject) => {
      const volumes = []
      const open = []
      const high = []
      const low = []
      const close = []

      for (let i = 0; i < data.length; i++) {
        volumes.push(data[i].volume)
        open.push(data[i].open)
        high.push(data[i].high)
        low.push(data[i].low)
        close.push(data[i].close)
      }

      resolve(null)
    })
  }
}

module.exports = TechnichalAnalysis
