'use strict'

/**
 * The Trader receives a signal and acts upon it.
 *
 * @param {String}  environment Defines the environment the trader is running in: `backtest`, `paper` or `live`
 */

class Trader {
  constructor (environment) {
    this.environment = environment
    this.accounts = null

    this.fees = null
    this.paidFees = 0

    this.setup()
  }

  setup () {
    switch (this.environment) {
      case 'backtest':
        this.fees = { maker: 0.4, taker: 0.4 }
        this.accounts = {
          USDT: 100,
          COIN: 0
        }
        break
      case 'paper':
        console.error('Paper trade: not yet implemented.')
        process.exit(1)
      case 'live':
        console.error('Live trade: not yet implemented.')
        break
      default:
        console.error('Invalid environment parameter for Trader.')
        process.exit(1)
    }
  }

  async run (signal) {
    return new Promise((resolve, reject) => {
      switch (signal.signal) {
        case 'long':
          if (this.environment === 'backtest') {
            const fees = parseFloat(Number.parseFloat(this.fees.maker / 100 * this.accounts.USDT).toFixed(8))
            this.paidFees += fees
            this.accounts.USDT -= fees

            this.accounts.COIN = parseFloat(Number.parseFloat((this.accounts.USDT / signal.lastCandle.close)).toFixed(8))
            this.accounts.USDT = 0
          }
          break
        case 'short':
          if (this.environment === 'backtest') {
            this.accounts.USDT = parseFloat(Number.parseFloat((this.accounts.COIN * signal.lastCandle.close)).toFixed(8))
            this.accounts.COIN = 0

            const fees = parseFloat(Number.parseFloat(this.fees.maker / 100 * this.accounts.USDT).toFixed(8))
            this.paidFees += fees
            this.accounts.USDT -= fees
          }
          break
        default:
          reject('Defaulted in Trader. This should not occur.')
      }

      resolve()
    })
  }
}

module.exports = Trader
