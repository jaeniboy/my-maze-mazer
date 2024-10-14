import Chart from "chart.js/auto"
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export const chart = () => {
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15],
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                // label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    display: false,
                },
                x: {
                    grid: {
                        display: false,
                    },
                },   
            },
            elements: {
                bar: {
                    backgroundColor: "#55757e",
                    borderWidth: 1,
                    borderColor: "#edf1e6", 
                    borderSkipped: false,
                    borderRadius: 5,
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
                          xMin: 2.2,
                          xMax: 2.2,
                          borderColor: '#aa5a4e',
                          borderWidth: 3,
                          backgroundColor: "white"
                        },
                        label1: {
                            type: 'label',
                            xValue: 2.5,
                            yValue: 17,
                            content: ['Your time'],
                            font: {
                              size: 12
                            }
                        }
                    }
                }
            }
        }
    });
}
