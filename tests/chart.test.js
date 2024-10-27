import { describe, test, expect, vi } from "vitest";
import { getSecondsFromTimeString, getDistributionFromData, chart, shiftTimeValues } from "../scripts/chart"
import { JSDOM } from "jsdom"
import { Chart } from "chart.js"

const fakeTimes = [
    8.23, 7.89, 9.56, 6.78, 
    10.12, 7.45, 8.67, 9.34
  ];

test("that seconds are computed correctly from time string", () => {
    expect(getSecondsFromTimeString("01:20.23")).toBe(80.23)
    expect(getSecondsFromTimeString("00:10.10")).toBe(10.1)
})

test("that values are shifted based on player time", ()=> {
    const fakeOthersTimes = [3,4,4,5,6,6,7]
    vi.spyOn(Math,"random").mockReturnValue(0.5)
    expect(shiftTimeValues(4, fakeOthersTimes)).toEqual([2,3,3,4,5,5,6])
    expect(shiftTimeValues(1, fakeOthersTimes)).toEqual([1,0,0,1,2,2,3])
    vi.restoreAllMocks()
})

test("that histogram data is delived correctly", () => {
    expect(getDistributionFromData(2.00,fakeTimes)).toEqual([0,0,0,0,0,0,1,2,2,2,1,0])
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
    
    const fakeData = [0,0,0,0,0,0,1,2,2,2,1,0]
    const fakeLabels = [...fakeData,0,0,0].map((d,i)=>i)
    const fakePlayerTime = 7.75
    chart(fakePlayerTime, fakeData)

    // check that chart is visible
    expect(document.querySelector("#myChart").style.display).toBe("block")

    // check that charts main configs are correct
    const thisChart = Chart.getChart("myChart").config._config
    expect(thisChart.type).toBe("bar")
    expect(thisChart.data.datasets[0].data).toEqual([...fakeData,0,0,0])
    expect(thisChart.data.labels).toEqual([
        0,  1,  2,  3,  4,  5,
        6,  7,  8,  9, 10, 11,
        12,13,14
     ])
    expect(thisChart.options.elements).toMatchSnapshot()
    expect(thisChart.options.plugins.legend.display).toBeFalsy()
    expect(thisChart.options.plugins.annotation.annotations.line1).toMatchSnapshot()
    expect(thisChart.options.plugins.annotation.annotations.label1).toMatchSnapshot()
    expect(thisChart.options.layout.padding).toMatchSnapshot()
    console.log(thisChart)

    vi.resetAllMocks()

})
