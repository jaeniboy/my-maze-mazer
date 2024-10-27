import Chart from "chart.js/auto"
import annotationPlugin from 'chartjs-plugin-annotation';
import { floatToTimeString } from "./popup";

export let gameChart = null

// generate chart data


export const getSecondsFromTimeString = (timestring) => {
    const [minutes, seconds] = timestring.split(':');
    const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
    return totalSeconds
}

export const getDistributionFromData = (playertime, data, maxSeconds = 15) => {
    const timesArray = [...data, playertime]
    maxSeconds = Math.floor(Math.max(...timesArray)) + 2
    const result = new Array(maxSeconds).fill(0);
    data.forEach(seconds => {
      const index = Math.floor(seconds);
      if (index < maxSeconds) {
        result[index]++;
      }
    });
    console.log(result)
    return result;
  }

export const shiftTimeValues = (playerTime, othersTimes) => {
    // get min and max values
    const min = Math.min(...othersTimes) - 2
    const max = Math.max(...othersTimes) + 2
    // get random number between min and max
    const randValue = Math.floor(Math.random() * (max - min + 1)) + min
    const diff = Math.floor(playerTime) - randValue
    const shiftedArray = othersTimes.map(d=> d !== 0 ? d + diff : 0)
    // turn negatives into positives
    const nonNegative = shiftedArray.map((d) => {return d < 0 ? d * (-1) : d})
    return nonNegative
}

// generate Chart

Chart.register(annotationPlugin);
Chart.defaults.font.family = '"curier new", monospace'

export const chart = (playerTime, data) => {
    const ctx = document.getElementById('myChart');
    data = [...data,0,0,0]
    const maxValue = Math.max(...data)
    const indexFirstVal = data[0] === 0 ? data.findIndex(d=>d>0) : 0
    const indexLastVal = data.findIndex((d,key)=>key>indexFirstVal && d == 0)
    const labels = data.map((d,i)=>i)
    const leftLabel = playerTime > indexLastVal ? true : false // todo
    gameChart = new Chart(ctx, {
        type: 'bar',
        data: {
            // generate labels based on array length
            labels: labels,
            datasets: [{
                data: data,
                barPercentage: 0.95,
                categoryPercentage: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    display: false,
                },
                x: {
                    min: indexFirstVal - 4,
                    max: indexLastVal + 4,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        align: "end",
                        crossAlign: "center",
                        padding: 3,
                        labelOffset: -7,
                    }
                },   
            },
            elements: {
                bar: {
                    backgroundColor: "rgba(85, 117, 126, 0.5)",
                    borderWidth: 2,
                    borderColor: "rgba(85, 117, 126, 1)", 
                    borderSkipped: "bottom",
                    borderRadius: 2,
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        line1: {
                          type: 'line',
                          xMin: playerTime,
                          xMax: playerTime,
                          yMin: 0,
                          yMax: maxValue * 1.5,
                        //   xMin: 2.2,
                        //   xMax: 2.2,
                          borderColor: '#aa5a4e',
                          borderWidth: 3,
                          backgroundColor: "white"
                        },
                        label1: {
                            type: 'label',
                            position: leftLabel ? "end" : "start",
                            padding: 2,
                            xValue: playerTime,
                            // xValue: 2.2,
                            yValue: leftLabel ? maxValue * 1.2 : maxValue * 1.5,
                            // yValue: 22,
                            content: leftLabel ? ['your time ⤻ '] : [' ⤺ your time'],
                            font: {
                              size: 12
                            }
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                }
            }
        }
    });
}
