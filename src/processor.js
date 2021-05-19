'use strict'

const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const readLastLines = require('read-last-lines')

/**
 * The Processor receives every single incoming candle.
 * It then appends it to the data file.
 * 
 * Finally it checks if it has enough sequential candles
 * in order to emit 'relevant' data.
 * 
 * @param {Integer} candlesAmount  Amount of candles the current strategy requires.
 */

class Processor {
  constructor(candlesAmount) {
    this.candlesAmount = candlesAmount
  }

  async newData(candle) {
    return new Promise((resolve, reject) => {
      if (
        candle.timestamp !== undefined &&
        candle.symbol !== undefined &&
        candle.open !== undefined &&
        candle.high !== undefined &&
        candle.low !== undefined &&
        candle.close !== undefined &&
        candle.volume !== undefined
      ) {
        try {
          const file = path.join(__dirname, `../data/${candle.symbol}.csv`)
          const data = `${candle.timestamp},${candle.symbol},${candle.open},${candle.high},${candle.low},${candle.close},${candle.volume}`

          const stream = fs.createWriteStream(file, { flags: 'a' })
          stream.write(data + '\n')
          stream.close()

          stream.on('finish', async () => {
            const relevantData = `timestamp,symbol,open,high,low,close,volume\n${await readLastLines.read(file, this.candlesAmount)}`
            const parsedRelevantData = parse(relevantData, { cast: true, columns: true })
            if (parsedRelevantData.length >= this.candlesAmount) {
              for (let i = 0; i < parsedRelevantData.length; i++) {
                if (i > 0) {
                  if (parsedRelevantData[i].timestamp !== parsedRelevantData[i - 1].timestamp + 60000) {
                    reject({ code: 0, message: 'Unsequential candles.' })
                    //This should send a signal back to the gatherer (if present) to attempt to request appropriate historic data.
                  }
                }
              }
              resolve(parsedRelevantData)
            } else {
              reject({ code: 0, message: 'Not enough candles.' })
            }
          })
        } catch (error) {
          reject({ code: 1, message: error })
        }
      } else {
        reject({ code: 1, message: 'Invalid candle format. A candle must contain timestamp, symbol and OHLVC data.' })
      }
    })
  }
}

module.exports = Processor