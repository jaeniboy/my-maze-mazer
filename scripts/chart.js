import Chart from "chart.js/auto"
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export const chart = (playerTime, data) => {
    const ctx = document.getElementById('myChart');
    const maxValue = Math.max(...data)
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15],
            datasets: [{
                // data: [0, 12, 19, 3, 5, 2, 3],
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
                            position: "start",
                            padding: 2,
                            xValue: playerTime,
                            // xValue: 2.2,
                            yValue: maxValue * 1.2,
                            // yValue: 22,
                            content: ['⤺ your time'],
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
