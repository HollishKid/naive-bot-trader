'use strict'

/* global Chart fetch */

class ChartClass {
  constructor() {
    this.server = null

    this.volumeData = []
    this.openData = []
    this.highData = []
    this.lowData = []
    this.closeData = []
    this.labelData = []

    this.yMin = 1000000000
    this.yMax = 0
    this.yMinRight = 1000000000
    this.yMaxRight = 0

    this.chart = null
    this.chartTA = null
    this.ctx = document.getElementById('chart')
    this.ctxTA = document.getElementById('chartTA')

    this.setup()
  }

  setup() {
    setTimeout(() => { this.queryData() }, 2000)

    this.chart = new Chart(this.ctx, {
      data: {
        labels: [],
        datasets: [{
          type: 'bar',
          label: 'Volume',
          backgroundColor: 'rgba(255, 255, 0, 1)',
          borderColor: 'rgb(255, 255, 0)',
          order: 7,
          data: [],
          yAxisID: 'rightY',
          parsing: {
            yAxisKey: 'volume'
          }
        }, {
          type: 'line',
          label: 'Open',
          backgroundColor: 'rgba(0, 255, 0, 0.7)',
          borderColor: 'rgb(0, 255, 0)',
          borderWidth: 1,
          pointRadius: 1,
          order: 6,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'open'
          }
        }, {
          type: 'line',
          label: 'High',
          backgroundColor: 'rgba(0, 0, 255, 0.7)',
          borderColor: 'rgb(0, 0, 255)',
          borderWidth: 1,
          pointRadius: 1,
          order: 5,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'high'
          }
        }, {
          type: 'line',
          label: 'Low',
          backgroundColor: 'rgba(0, 255, 255, 0.7)',
          borderColor: 'rgb(0, 255, 255)',
          borderWidth: 1,
          pointRadius: 1,
          order: 4,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'low'
          }
        }, {
          type: 'line',
          label: 'Close',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 1,
          pointRadius: 1,
          order: 3,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'close'
          }
        }, {
          type: 'line',
          label: 'Long',
          backgroundColor: 'rgba(0, 255, 0, 1)',
          borderColor: 'rgb(0, 255, 0)',
          pointRadius: 6,
          fill: false,
          showLine: false,
          order: 2,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'long'
          }
        }, {
          type: 'line',
          label: 'Short',
          backgroundColor: 'rgba(255, 0, 0, 1)',
          borderColor: 'rgb(255, 0, 0)',
          pointRadius: 6,
          fill: false,
          showLine: false,
          order: 1,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'short'
          }
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        normalized: true,
        plugins: {
          decimation: {
            enabled: true,
            algorithm: 'min-max'
          },
          zoom: {
            pan: {
              enabled: true,
              modifierKey: 'ctrl',
              mode: 'xy'
            },
            zoom: {
              drag: {
                enabled: true
              },
              wheel: {
                enabled: true
              },
              mode: 'xy'
            }
          }
        },
        scales: {
          leftY: {
            type: 'linear',
            position: 'left',
            min: this.yMin,
            max: this.yMax
          },
          rightY: {
            type: 'linear',
            position: 'right',
            min: this.yMinRight,
            max: this.yMaxRight
          }
        }
      }
    })

    this.chartTA = new Chart(this.ctxTA, {
      data: {
        labels: [],
        datasets: [{
          type: 'line',
          label: 'ADX',
          backgroundColor: 'rgba(0, 255, 0, 0.7)',
          borderColor: 'rgb(0, 255, 0)',
          borderWidth: 1,
          pointRadius: 1,
          order: 6,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'adx'
          }
        }, {
          type: 'line',
          label: 'ADX_pdi',
          backgroundColor: 'rgba(0, 128, 0, 0.7)',
          borderColor: 'rgb(0, 128, 0)',
          borderWidth: 1,
          pointRadius: 1,
          order: 5,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'adx_pdi'
          }
        }, {
          type: 'line',
          label: 'ADX_mdi',
          backgroundColor: 'rgba(144, 238, 144, 0.7)',
          borderColor: 'rgb(144, 238, 144)',
          borderWidth: 1,
          pointRadius: 1,
          order: 4,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'adx_mdi'
          }
        }, {
          type: 'line',
          label: 'AO',
          backgroundColor: 'rgba(0, 0, 255, 0.7)',
          borderColor: 'rgb(0, 0, 255)',
          borderWidth: 1,
          pointRadius: 1,
          order: 3,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'ao'
          }
        }, {
          type: 'line',
          label: 'FI',
          backgroundColor: 'rgba(0, 255, 255, 0.7)',
          borderColor: 'rgb(0, 255, 255)',
          borderWidth: 1,
          pointRadius: 1,
          order: 2,
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'fi'
          }
        }, {
          type: 'line',
          label: 'MACD',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 1,
          pointRadius: 1,
          order: 1,
          data: [],
          yAxisID: 'rightY',
          parsing: {
            yAxisKey: 'macd'
          }
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        normalized: true,
        plugins: {
          decimation: {
            enabled: true,
            algorithm: 'min-max'
          },
          zoom: {
            pan: {
              enabled: true,
              modifierKey: 'ctrl',
              mode: 'xy'
            },
            zoom: {
              drag: {
                enabled: true
              },
              wheel: {
                enabled: true
              },
              mode: 'xy'
            }
          }
        },
        scales: {
          leftY: {
            type: 'linear',
            position: 'left',
            min: -100,
            max: 100
          },
          rightY: {
            type: 'linear',
            position: 'right',
            min: -10,
            max: 10
          }
        }
      }
    })
  }



  async queryData() {
    try {
      const data = await fetch('/data')
      const newData = await data.json()
      if (newData.code === 0) {
        this.addData(newData.data, newData.signals, newData.tas)
      } else {
        console.info('Waiting for data to be prepared by server...')
        setTimeout(() => { this.queryData() }, 2000)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async addData(data, signals, tas) {
    console.info('Starting data process...')
    for (let i = 0; i < data.length; i++) {
      if (data[i].volume > this.yMaxRight) {
        this.yMaxRight = data[i].volume
      } else if (data[i].volume < this.yMinRight) {
        this.yMinRight = data[i].volume
      }

      if (data[i].open > this.yMax) {
        this.yMax = data[i].open
      } else if (data[i].open < this.yMin) {
        this.yMin = data[i].open
      }

      if (data[i].high > this.yMax) {
        this.yMax = data[i].high
      } else if (data[i].high < this.yMin) {
        this.yMin = data[i].high
      }

      if (data[i].low > this.yMax) {
        this.yMax = data[i].low
      } else if (data[i].low < this.yMin) {
        this.yMin = data[i].low
      }

      if (data[i].close > this.yMax) {
        this.yMax = data[i].close
      } else if (data[i].close < this.yMin) {
        this.yMin = data[i].close
      }

      let signal = null
      for (let j = 0; j < signals.length; j++) {
        if (signals[j].lastCandle.timestamp === data[i].timestamp) {
          signal = signals[j]
          break
        }
      }

      this.chart.data.datasets.forEach((dataset) => {
        switch (dataset.label) {
          case 'Volume':
            dataset.data.push({ x: data[i].timestamp, volume: data[i].volume })
            break
          case 'Open':
            dataset.data.push({ x: data[i].timestamp, open: data[i].open })
            break
          case 'High':
            dataset.data.push({ x: data[i].timestamp, high: data[i].high })
            break
          case 'Low':
            dataset.data.push({ x: data[i].timestamp, low: data[i].low })
            break
          case 'Close':
            dataset.data.push({ x: data[i].timestamp, close: data[i].close })
            break
          case 'Long':
            if (signal && signal.signal === 'long') {
              dataset.data.push({ x: data[i].timestamp, long: data[i].close })
              console.log('LONG')
            } else {
              dataset.data.push({ x: data[i].timestamp, long: null })
            }
            break
          case 'Short':
            if (signal && signal.signal === 'short') {
              dataset.data.push({ x: data[i].timestamp, short: data[i].close })
              console.log('SHORT')
            } else {
              dataset.data.push({ x: data[i].timestamp, long: null })
            }
            break
        }
      })

      if (tas[i] !== null) {
        this.chartTA.data.datasets.forEach((dataset) => {
          switch (dataset.label) {
            case 'ADX':
              dataset.data.push({ x: data[i].timestamp, adx: tas[i].adxResult.adx })
              break
            case 'ADX_pdi':
              dataset.data.push({ x: data[i].timestamp, adx_pdi: tas[i].adxResult.pdi })
              break
            case 'ADX_mdi':
              dataset.data.push({ x: data[i].timestamp, adx_mdi: tas[i].adxResult.mdi })
              break
            case 'AO':
              dataset.data.push({ x: data[i].timestamp, ao: tas[i].aoResult })
              break
            case 'FI':
              dataset.data.push({ x: data[i].timestamp, fi: tas[i].fiResult })
              break
            case 'MACD':
              dataset.data.push({ x: data[i].timestamp, macd: tas[i].macdResult.histogram })
              break
          }
        })
      }

      this.chart.data.labels.push(new Date(data[i].timestamp).toLocaleString(undefined, { timeZone: 'UTC' }))
      this.chartTA.data.labels.push(new Date(data[i].timestamp).toLocaleString(undefined, { timeZone: 'UTC' }))
    }

    /*for (let i = 0; i < signals.length; i++) {
      switch (signals[i].signal) {
        case 'long':
          this.chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Long') {
              dataset.data.push({ x: signals[i].lastCandle.timestamp, long: signals[i].lastCandle.close })
            }
          })
          break
        case 'short':
          this.chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Short') {
              dataset.data.push({ x: signals[i].lastCandle.timestamp, short: signals[i].lastCandle.close })
            }
          })
          break
      }
    }*/
    console.info('Transpiled all data, starting display...')

    this.chart.options.scales.leftY.min = this.yMin
    this.chart.options.scales.leftY.max = this.yMax
    this.chart.options.scales.rightY.min = this.yMinRight
    this.chart.options.scales.rightY.max = this.yMaxRight

    console.info('Added all data to chart, updating...')

    this.chart.update()
    this.chartTA.update()
    console.info('Updated chart.')
    this.queryData()
  }
}

const chart = new ChartClass()
