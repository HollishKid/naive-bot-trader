'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const { createHttpTerminator } = require('http-terminator')

class Server {
  constructor() {
    this.server = null
    this.httpTerminator = null
    this.backtestingDone = false
    this.newCandles = []
    this.newSignals = []

    this.sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    this.setup()
  }

  setup() {
    this.server = http.createServer((request, response) => {
      switch (request.url) {
        case '/':
          response.writeHead(200, { 'content-type': 'text/html' })
          fs.createReadStream(path.join(__dirname, 'chart.html')).pipe(response)
          break
        case '/data':
          if (this.newCandles.length > 0) {
            response.writeHead(200, { 'content-type': 'application/json' })
            response.end(JSON.stringify({ code: 0, data: this.newCandles, signals: this.newSignals }))
            this.newCandles = []
            this.newSignals = []
          } else {
            response.writeHead(200, { 'content-type': 'application/json' })
            response.end(JSON.stringify({ code: 1, data: null }))
          }
          break
        case '/js':
          response.writeHead(200, { 'content-type': 'application/javascript' })
          fs.createReadStream(path.join(__dirname, 'chart.js')).pipe(response)
          break
        case '/chartJS':
          response.writeHead(200, { 'content-type': 'application/javascript' })
          fs.createReadStream(path.join(__dirname, '../../node_modules/chart.js/dist/chart.min.js')).pipe(response)
          break
        case '/chartZoom':
          response.writeHead(200, { 'content-type': 'application/javascript' })
          fs.createReadStream(path.join(__dirname, '../../node_modules/chartjs-plugin-zoom/dist/chartjs-plugin-zoom.min.js')).pipe(response)
          break
        case '/hammerJS':
          response.writeHead(200, { 'content-type': 'application/javascript' })
          fs.createReadStream(path.join(__dirname, '../../node_modules/hammerjs/hammer.js')).pipe(response)
          break
      }
    })

    this.httpTerminator = createHttpTerminator({ server: this.server })

    this.server.listen(3000)

    setTimeout(() => { this.shutDown() }, 4000)
  }

  async newData (candle) {
    this.newCandles.push(candle)
  }

  async newSignal (signal) {
    this.newSignals.push(signal)
  }

  async shutDown () {
    if (this.backtestingDone && this.newCandles.length === 0 && this.newSignals.length === 0) {
      console.info('Chart received all data, shutting down.')
      try {
        await this.httpTerminator.terminate()
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    } else {
      setTimeout(() => { this.shutDown() }, 4000)
    }
  }
}

module.exports = Server
