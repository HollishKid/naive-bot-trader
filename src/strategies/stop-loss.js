'use strict'

/**
 * A Strategy receives a certain span of candles and returns a signal for the Trader.
 * Any strategy should define in their constructor:
 * - candlesAmount (amount of candles to receive)
 *
 * @param   {Object}  trader  A reference to the Trader class.
 * @returns {Promise}         Promise that resolves to `short`, `long` or `null`.
 */

class StopLoss {
  constructor (trader) {
    this.trader = trader
    this.lastStableAmount = trader.lastStableAmount
    this.lastCoinAmount = trader.lastCoinAmount

    this.candlesAmount = 2
  }

  async run (currentSignal, data) {
    return new Promise((resolve, reject) => {
      const candleToStable = parseFloat(Number.parseFloat((this.trader.lastCoinAmount * data[data.length - 1].close)).toFixed(8))
      const stablePlusFees = this.trader.lastStableAmount + ( this.trader.lastStableAmount * this.trader.fees.taker / 100)
      //console.log(this.trader.lastCoinAmount * data[data.length - 1].close)
      //console.log(stablePlusFees)
      if (data[0].close > data[1].close && candleToStable < stablePlusFees) {
        resolve('long')
      } else if (candleToStable > stablePlusFees) {
        resolve('short')
      }

      resolve(null)
    })
  }
}

module.exports = StopLoss
