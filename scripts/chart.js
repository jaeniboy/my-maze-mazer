import Chart from "chart.js/auto"
import annotationPlugin from 'chartjs-plugin-annotation';

// generate chart data

export const getSecondsFromTimeString = (timestring) => {
    const [minutes, seconds] = timestring.split(':');
    const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
    return totalSeconds
}

export const getDistributionFromData = (playertime, data, maxSeconds = 15) => {
    const timesArray = [...data.map(d=>d.time), playertime].map(time=>getSecondsFromTimeString(time))
    maxSeconds = Math.floor(Math.max(...timesArray)) + 2
    const result = new Array(maxSeconds).fill(0);
    data.forEach(item => {
      const totalSeconds = getSecondsFromTimeString(item.time)
      const index = Math.floor(totalSeconds);
      if (index < maxSeconds) {
        result[index]++;
      }
    });
    console.log(result)
    return result;
  }

export const shiftDistribution = (playerTime, distributionArray) => {
    // get min and max values
    const filteredArray = distributionArray.filter(d=>d)
    const min = Math.min(...filteredArray)
    const max = Math.max(...filteredArray)
    const randValue = Math.floor(Math.random() * (max - min + 1)) + min
    const diff = Math.floor(playerTime) - randValue
    const shiftedArray = distributionArray.map(d=> d !== 0 ? d + diff : 0)
    console.log(shiftedArray)
}

// generate Chart

Chart.register(annotationPlugin);
Chart.defaults.font.family = '"curier new", monospace'

export const chart = (playerTime, data) => {
    const ctx = document.getElementById('myChart');
    const maxValue = Math.max(...data)
    const leftLabel = playerTime > data.length - 3 ? true : false
    console.log(leftLabel)
    new Chart(ctx, {
        type: 'bar',
        data: {
            // generate labels based on array length
            labels: data.map((d,i)=>i),
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
                            yValue: maxValue * 1.2,
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
