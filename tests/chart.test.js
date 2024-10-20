import { describe, test, expect, vi } from "vitest";
import { getSecondsFromTimeString, getDistributionFromData, chart } from "../scripts/chart"
import { JSDOM } from "jsdom"
import { Chart } from "chart.js"

const fakePlayers = [
    {"name": "Luca Rossi", "time": "00:08.23"},
    {"name": "Sofia Müller", "time": "00:07.89"},
    {"name": "Aisha Khan", "time": "00:09.56"},
    {"name": "Mateo Garcia", "time": "00:06.78"},
    {"name": "Yuki Tanaka", "time": "00:10.12"},
    {"name": "Anya Ivanova", "time": "00:07.45"},
    {"name": "Nina Schmidt", "time": "00:08.67"},
    {"name": "Omar Ahmed", "time": "00:09.34"}
]

test("that seconds are computed correctly from time string", () => {
    expect(getSecondsFromTimeString("01:20.23")).toBe(80.23)
    expect(getSecondsFromTimeString("00:10.10")).toBe(10.1)
})

test("that histogram data is delived correctly", () => {
    expect(getDistributionFromData(fakePlayers)).toEqual([0,0,0,0,0,0,1,2,2,2,1,0,0,0,0])
})

test("that chart is added to dom", () => {
    const dom = new JSDOM("<div id='container'><canvas id='myChart'></canvas></div>")
    global.document = dom.window.document

    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));
      
      // Stub the global ResizeObserver
      vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    
    const fakeData = [0,0,0,0,0,0,1,2,2,2,1,0,0,0,0]
    const fakePlayerTime = 7.75
    chart(fakePlayerTime, fakeData)

    // check that chart is visible
    expect(document.querySelector("#myChart").style.display).toBe("block")

    // check that charts main configs are correct
    const thisChart = Chart.getChart("myChart").config._config
    expect(thisChart.type).toBe("bar")
    expect(thisChart.data.labels).toEqual([
        0,  1,  2,  3,  4,  5,
        6,  7,  8,  9, 10, 11,
       12, 13, 14, 15
     ])
    expect(thisChart.data.datasets[0].data).toEqual(fakeData)
    expect(thisChart.options.elements).toMatchSnapshot()
    expect(thisChart.options.plugins.legend.display).toBeFalsy()
    expect(thisChart.options.plugins.annotation.annotations.line1).toMatchSnapshot()
    expect(thisChart.options.plugins.annotation.annotations.label1).toMatchSnapshot()
    expect(thisChart.options.layout.padding).toMatchSnapshot()

    vi.resetAllMocks()

})
