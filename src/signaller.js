'use strict'

const path = require('path')

/**
 * The Signaller imports the strategy.
 * It then receives the new relevant data every time it becomes available
 * and emits a signal based on the strategy.
 * 
 * It is also dependant on the Trader which holds information about the current status of the accounts.
 *
 * @param {Object}  trader    A reference to the Trader class.
 * @param {String}  strategy  Path to the strategy .js file.
 */

class Signaller {
  constructor (trader, strategy) {
    this.trader = trader
    this.strategyPath = strategy
    this.strategy = null

    this.currentSignal = null

    this.setup()
  }

  setup () {
    try {
      this.StrategyModule = require(path.join(__dirname, `./strategies/${this.strategyPath}`))
      this.strategy = new this.StrategyModule(this.trader)

      if (!this.strategy) {
        throw new Error()
      }
    } catch (error) {
      console.error(`Strategy ${this.strategyModule} could not be loaded correctly.`)
      process.exit(1)
    }
  }

  async newRelevantData (relevantData) {
    const newSignal = await this.strategy.run(this.currentSignal, relevantData)
    if (newSignal.signal) {
      this.currentSignal = newSignal.signal
      return { signal: newSignal.signal, lastCandle: relevantData[relevantData.length - 1], ta: newSignal.ta  }
    }

    return { signal: null, lastCandle: relevantData[relevantData.length - 1], ta: newSignal.ta  }
  }
}

module.exports = Signaller
