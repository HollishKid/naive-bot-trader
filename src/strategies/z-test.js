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
  constructor(trader) {
    this.trader = trader

    this.candlesAmount = 3

    this.longMax = 0
    this.amountOfLongs = 0
    this.decreasesAmount = 0

    this.totalBoughtValue = 0
  }

  async run(currentSignal, data) {
    return new Promise((resolve, reject) => {
      const previousIncreaseRate = (data[0].close - data[1].close) / data[0].close
      const currentIncreaseRate = (data[1].close - data[2].close) / data[1].close
      if (data[1].close > data[2].close && this.trader.accounts.USDT > 0) {
        this.decreasesAmount = 0
        this.amountOfLongs++
        if (this.longMax < this.amountOfLongs) {
          this.longMax = this.amountOfLongs
          console.log(this.longMax)
        }

        if (this.amountOfLongs === 1) {
          this.totalBoughtValue += parseFloat(Number.parseFloat(this.trader.accounts.USDT * 0.2).toFixed(2))
          resolve({ signal: 'long', percent: 0.2, ta: null })
        } else if (this.amountOfLongs === 2) {
          this.totalBoughtValue += parseFloat(Number.parseFloat(this.trader.accounts.USDT * 0.5).toFixed(2))
          resolve({ signal: 'long', percent: 0.5, ta: null })
        } else if (this.amountOfLongs === 3) {
          this.totalBoughtValue += parseFloat(Number.parseFloat(this.trader.accounts.USDT * 1).toFixed(2))
          resolve({ signal: 'long', percent: 1, ta: null })
        }

        resolve({ signal: null, ta: null })
      }

      if (data[1].close > data[2].close && this.trader.accounts.USDT === 0) {
        this.decreasesAmount = 0
        const candleToUSDT = parseFloat(Number.parseFloat((this.trader.accounts.COIN * data[data.length - 1].close)).toFixed(8))
        if (currentIncreaseRate <= previousIncreaseRate) {
          if (candleToUSDT > this.totalBoughtValue * 1.004) {
            if (this.decreasesAmount < 2) {
              resolve({ signal: null, ta: null })
            } else if (this.decreasesAmount >= 2) {
              this.totalBoughtValue = 0
              resolve({ signal: 'short', ta: null })
            }
          } else {
            //Maybe implement a STOP LOSS here
            resolve({ signal: null, ta: null })
          }

          resolve({ signal: null, ta: null })
        }
      }

      if (data[1].close < data[2].close && this.trader.accounts.USDT > 0) {
        const candleToUSDT = parseFloat(Number.parseFloat((this.trader.accounts.COIN * data[data.length - 1].close)).toFixed(8))
        if (candleToUSDT > this.totalBoughtValue * 1.004) {
          if (this.decreasesAmount < 2) {
            this.decreasesAmount++
            resolve({ signal: null, ta: null })
          } else if (this.decreasesAmount >= 2) {
            this.amountOfLongs = 0
            this.totalBoughtValue = 0
            resolve({ signal: 'short', ta: null })
          }
        } else {
          //Maybe implement a STOP LOSS here
          resolve({ signal: null, ta: null })
        }
      }

      if (data[1].close < data[2].close && this.trader.accounts.USDT === 0) {
        const candleToUSDT = parseFloat(Number.parseFloat((this.trader.accounts.COIN * data[data.length - 1].close)).toFixed(8))
        if (candleToUSDT > this.totalBoughtValue * 1.004) {
          if (this.decreasesAmount < 2) {
            this.decreasesAmount++
            resolve({ signal: null, ta: null })
          } else if (this.decreasesAmount >= 2) {
            this.amountOfLongs = 0
            this.totalBoughtValue = 0
            resolve({ signal: 'short', ta: null })
          }
        } else {
          //Maybe implement a STOP LOSS here
          resolve({ signal: null, ta: null })
        }
      }

      resolve({ signal: null, ta: null })
    })
  }
}

module.exports = NaiveStrategy
