'use strict'

const TA = require('technicalindicators')

/**
 * A Strategy receives a certain span of candles and returns a signal for the Trader.
 * Any strategy should define in their constructor:
 * - candlesAmount (amount of candles to receive)
 *
 * @param   {Object}  trader  A reference to the Trader class.
 * @returns {Promise}         Promise that resolves to `short`, `long` or `null`.
 */

class TechnichalAnalysis {
  constructor(trader) {
    this.trader = trader

    this.candlesAmount = 34
  }

  async run(currentSignal, data) {
    return new Promise((resolve, reject) => {
      const volume = []
      const open = []
      const high = []
      const low = []
      const close = []

      const results = {}

      for (let i = 0; i < data.length; i++) {
        volume.push(data[i].volume)
        open.push(data[i].open)
        high.push(data[i].high)
        low.push(data[i].low)
        close.push(data[i].close)
      }

      const adx = new TA.ADX({ 
        period: 14, 
        high: high.slice(-28), 
        low: low.slice(-28), 
        close: close.slice(-28)
      })
      results.adxResult = adx.getResult()[0]

      const ao = new TA.AwesomeOscillator({ 
        fastPeriod: 5, 
        slowPeriod: 34, 
        high: high.slice(-34), 
        low: low.slice(-34), 
        format: (a)=>parseFloat(a.toFixed(2)) 
      })
      results.aoResult = ao.getResult()[0]

      const fi = new TA.ForceIndex({
        period: 13,
        close: close.slice(-14),
        volume: volume.slice(-14)
      })
      results.fiResult = fi.getResult()[0]

      const macd = new TA.MACD({
        fastPeriod: 5, 
        slowPeriod: 8,
        signalPeriod: 3,
        values: close.slice(-10),
        SimpleMAOscillator: false,
        SimpleMASignal: false
      })
      results.macdResult = macd.getResult().slice(-1)[0]

      // Complex interpretation
      /*const obv = new TA.OBV({
        close: close.slice(-14),
        volume: volume.slice(-14)
      })
      results.obvResult = obv.getResult().slice(-1)[0] */

      // Signals seem to be the exact opposite of what is expected?!
      /*const rsi = new TA.RSI({
        period: 14,
        values: close.slice(-15)
      })
      results.rsiResult = rsi.getResult()[0]*/

      // Complex interpretation
      /*const kd = new TA.Stochastic({
        period: 14, 
        signalPeriod: 3,
        high: high.slice(-16), 
        low: low.slice(-16), 
        close: close.slice(-16)
      })
      results.kdResult = kd.getResult().slice(-1)[0]*/

      if (
        results.adxResult.adx > 20 &&
        results.adxResult.pdi > results.adxResult.mdi &&
        results.aoResult > 0 &&
        results.fiResult > 0 &&
        results.macdResult.histogram > 0 
      ) {
        resolve('long')
      } else if (
        results.adxResult.adx > 20 &&
        results.adxResult.pdi < results.adxResult.mdi &&
        results.aoResult < 0 &&
        results.fiResult < 0 &&
        results.macdResult.histogram < 0
      ) {
        resolve('short')
      }

      resolve(null)
    })
  }
}

module.exports = TechnichalAnalysis
