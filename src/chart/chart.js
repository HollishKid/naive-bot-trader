'use strict'

/* global Chart fetch */

class ChartClass {
  constructor () {
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
    this.ctx = document.getElementById('chart')
    this.status = document.getElementById('status')

    this.setup()
  }

  setup () {
    setTimeout(() => { this.queryData() }, 2000)

    this.chart = new Chart(this.ctx, {
      data: {
        labels: [],
        datasets: [{
          type: 'bar',
          label: 'Volume',
          backgroundColor: 'rgba(255, 255, 0, 0.7)',
          borderColor: 'rgb(255, 255, 0)',
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
          data: [],
          yAxisID: 'leftY',
          parsing: {
            yAxisKey: 'close'
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
  }

  async queryData () {
    try {
      const data = await fetch('/data')
      const newData = await data.json()
      if (newData.code === 0) {
        this.addData(newData.data)
      } else {
        console.info('Waiting for data to be prepared by server...')
        this.status.innerHTML = 'Waiting for data to be prepared by server...'
        setTimeout(() => { this.queryData() }, 2000)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async addData (data) {
    console.info('Starting data process...')
    this.status.innerHTML = 'Starting data process...'
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
        }
      })

      this.chart.data.labels.push(new Date(data[i].timestamp).toLocaleString(undefined, { timeZone: 'UTC' }))
    }
    console.info('Transpiled all data, starting display...')
    this.status.innerHTML = 'Transpiled all data, starting display...'

    this.chart.options.scales.leftY.min = this.yMin
    this.chart.options.scales.leftY.max = this.yMax
    this.chart.options.scales.rightY.min = this.yMinRight
    this.chart.options.scales.rightY.max = this.yMaxRight

    console.info('Added all data to chart, updating...')
    this.status.innerHTML = 'Added all data to chart, updating...'

    this.chart.update()
    console.info('Updated chart.')
    this.queryData()
  }
}

const chart = new ChartClass()
