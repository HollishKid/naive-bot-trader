'use strict'

const path = require('path')

/**
 * The Signaller imports the strategy.
 * It then receives the new relevant data every time it becomes available
 * and emits a signal based on the strategy.
 *
 * @param {String}  strategy  Path to the strategy .js file
 */

class Signaller {
  constructor (strategy) {
    this.strategyPath = strategy
    this.strategy = null

    this.currentSignal = null

    this.setup()
  }

  setup () {
    try {
      this.StrategyModule = require(path.join(__dirname, `./strategies/${this.strategyPath}`))
      this.strategy = new this.StrategyModule()

      if (!this.strategy) {
        throw new Error()
      }
    } catch (error) {
      console.error(`Strategy ${this.strategyModule} could not be loaded correctly.`)
      process.exit(1)
    }
  }

  async newRelevantData (relevantData) {
    const newSignal = await this.strategy.run(relevantData)
    if (newSignal && this.currentSignal !== newSignal) {
      this.currentSignal = newSignal
      return { signal: newSignal, lastCandle: relevantData[relevantData.length - 1] }
    }

    return null
  }
}

module.exports = Signaller
