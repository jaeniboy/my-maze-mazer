import { test, expect, vi, describe, beforeEach } from "vitest";
import { maxSquareSize, applySquareSize, renderSetupPage, startGame, resetTimer} from "../scripts/utils";
import * as utils from '../scripts/utils';
import * as exp from "../scripts/exports";
import {JSDOM} from "jsdom"

test.each([
    [10, 10, 8],
    [20, 10, 4],
    [10, 20, 4],
    [11, 11, 8]
])("that x: %i and y: %i lead to max square size of %i", (a, b, expected) => {
    const container = { offsetWidth: 100, offsetHeight: 100 }
    // expect(maxSquareSize(a, b, container)).toBe(expected)
    expect(utils.maxSquareSize(a, b, container)).toBe(expected)
})

describe("adjustes square size", ()=> {
    test("that square size is applied to style sheet", () => {
        // global.document = {
        const doc = {
            styleSheets: [
                {},
                {
                    cssRules: [{
                        selectorText: '.square'
                    }],
                    deleteRule: vi.fn(),
                    insertRule: vi.fn()
                }
            ]
        }

        // applySquareSize(10, 10, { offsetWidth: 100, offsetHeight: 100 })
        utils.applySquareSize(10, 10, { offsetWidth: 100, offsetHeight: 100 }, doc)
        const styleSheet = doc.styleSheets[1];
        
        expect(styleSheet.deleteRule).toHaveBeenCalledWith(0)
        expect(styleSheet.insertRule).toHaveBeenCalledWith('.square {width:8px; height:8px}',
            0
        );

        vi.restoreAllMocks()
    })
})

describe("that setup page is build correctly", ()=>{
    const dom = new JSDOM("<div id='container'></div>")
    global.document = dom.window.document
    const container = document.getElementById("container")

    // renderSetupPage(container)
    vi.spyOn(utils, "sizeRecommended").mockReturnValue({x: 20, y: 30})
    utils.renderSetupPage(container)

    test("that select and input fields exist",()=>{
        const selects = container.getElementsByTagName("select")
        expect(selects.length).toBe(2)
        const selectIDs = [...selects].map(d=>d.id)
        expect(selectIDs).toEqual(["select-dimx", "select-dimy"])
        const inputs = container.getElementsByTagName("input")
        expect(inputs.length).toBe(1)
        expect(inputs[0].id).toBe("seed")
    })
    
    const button = container.getElementsByTagName("button")
    test("that create button exists",() => {
        expect(button.length).toBe(1)
        expect(button[0].id).toBe("start-game-button")
    })

    test("that button click starts game",()=>{
        const startGameSpy = vi.spyOn(utils, 'startGame').mockImplementation(()=>{})
        button[0].click()
        expect(startGameSpy).toHaveBeenCalled()
    })

    vi.restoreAllMocks()
})

describe("that game is started correctly",()=>{
    
    const x = 20
    const y = 30

    const dom = new JSDOM(`
        <div id="container">
            <select id="select-dimx" value="${x}">
                <option selected>${x}</option>
            </select>
            <select id="select-dimy" value="${y}">
                <option selected>${y}</option>
            </select>
            <input id="seed" value="1234">        
        </div>
        <div id="footer">
            <div class="backwards"></div>
            <div class="maze-info"></div>
            <div class="download">
                <i class="bi bi-download"></i>
                <div id="download-popup">
                    <div id="download-png">PNG</div>
                    <div id="download-svg">SVG</div>
                </div>
                </div>
                <div id="download-popup-overlay">
            </div>
        </div>
    `)

    global.document = dom.window.document
    const container = document.getElementById("container")
    
    vi.spyOn(utils, 'applySquareSize').mockImplementation(()=>{}) // dosn't work
    // vi.mock("../scripts/utils", async () => { 
    //     const myutils = await vi.importActual("../scripts/utils")
    //     return {
    //         ... myutils,
    //         applySquareSize: vi.fn().mockReturnValue("foobar")
    //     }
    // })

    // startGame(container)
    vi.spyOn(utils, "startTimer").mockImplementation(()=>{})
    utils.startGame(container)

    test("that maze has enough rows and squares",()=>{
        const rows = container.getElementsByClassName("row")
        const squares = container.getElementsByClassName("square")

        expect(rows.length).toBe(y + 1)
        expect(squares.length).toBe((x + 1) * (y + 1))
        // expect(foo).toHaveBeenCalled()
    })

    test("that one field has class 'hovered'",()=> {
        const hovered = container.getElementsByClassName("hovered")
        expect(hovered.length).toBe(1)
    })

    test.skip("that applySquareSize is called on window resize",()=>{
        // const bar = vi.spyOn(utils, 'applySquareSize')
        global.innerWidth = "500"
        global.dispatchEvent(new Event('resize'));
        expect(bar).toHaveBeenCalled()

        // does not work unfortunately
    })

    test.skip("that drawMaze is called on mousemove",()=> {
        // not implemented yet
    })
    
    
    vi.restoreAllMocks()
    
})

describe("time counter", () => {

    beforeEach(() => {
        vi.useFakeTimers()
      })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const dom = new JSDOM("<div id='container'><div id='timer-container'>dummy</div></div>")
    global.document = dom.window.document
    const timerContainer = document.querySelector("#timer-container")
    test("that time is displayed correctly", () => {
        vi.spyOn(utils, "timeDifference")
            .mockReturnValueOnce(510)
            .mockReturnValueOnce(2000)
            .mockReturnValueOnce(2510)
            .mockReturnValueOnce(20000)
            .mockReturnValueOnce(200000)
            .mockReturnValueOnce(1234567)
            .mockReturnValueOnce(6000000)

        utils.startTimer()

        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("00:00.51")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("00:02.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("00:02.51")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("00:20.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("03:20.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("20:34.57")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerHTML).toBe("100:00.00")

    })

    vi.restoreAllMocks()

})

test("that random seed value is iserted on click", () => {
    const dom = new JSDOM('<div id="container"><input type="text" id="seed" name="seed" value="1234"></div>')
    global.document = dom.window.document

    const initSeed = document.querySelector("#seed").value
    utils.insertRandSeed()
    const firstRand = document.querySelector("#seed").value
    utils.insertRandSeed()
    const secondRand = document.querySelector("#seed").value
    
    expect(firstRand).not.toBe(initSeed)
    expect(secondRand).not.toBe(firstRand)
})

test("that timer is resetted", ()=> {
    const dom = new JSDOM(`
        <div id='container'>
            <div id='timer-container'></div>
        </div>
        `)

    global.document = dom.window.document
    const timer = document.getElementById("timer-container")
    timer.innerText = "00:00.11"
    utils.resetTimer()
    expect(timer.innerText).toBe("00:00.00")
})

test("that footer content visibility toggles", () => {
    const dom = new JSDOM(`
        <div id="timer-container"></div>
        <div id="container">
            <div>some content...</div>
        </div>
        <div id="footer">
            <div class="backwards">back</div>
            <div class="maze-info">seed</div>
            <div class="download">
                <i class="bi bi-download"></i>
                <div id="download-popup">
                    <div id="download-png">PNG</div>
                    <div id="download-svg">SVG</div>
                </div>
                <div id="download-popup-overlay">
            </div>
        </div>
        <input id="seed">1234</input>
        `)

    global.document = dom.window.document
    const button = document.querySelector(".backwards")
    utils.showFooterContent()
    expect(button.classList.contains("visible")).toBeTruthy()
    expect(document.querySelector(".maze-info").classList.contains("visible")).toBeTruthy()
    
    const spyDestroyChart = vi.spyOn(utils, "destroyChart").mockImplementation(()=>{})
    const spySizeOptions = vi.spyOn(utils, "sizeOptions").mockImplementation(()=>{})
    button.click()

    expect(button.classList.contains("visible")).toBeFalsy()
    expect(document.querySelector(".maze-info").classList.contains("visible")).toBeFalsy()
    expect(document.querySelector(".download").classList.contains("visible")).toBeFalsy()

    expect(document.querySelector("#timer-container").innerText).toBe("00:00.00")
    console.log(document.querySelector("#timer-container").innerHTML)
    expect(document.querySelector("#container").innerHTML).toMatchSnapshot()
    expect(spyDestroyChart).toHaveBeenCalled()
    expect(spySizeOptions).toHaveBeenCalled()

    vi.restoreAllMocks()
})

test.skip("that settings are written to local storage", () => {
    const dom = new JSDOM(`
        <div id="container">
            <label for="dimx">Anzahl x:</label>
            <input type="text" id="dimx" name="x" value="10">
            <label for="dimy">Anzahl y:</label>
            <input type="text" id="dimy" name="y" value="10">
            <label for="seed">Seed:</label>
            <div id="seed-input-area">
            <input type="text" id="seed" name="seed" value="12345"><span id="random-seed">⟳</span>
            </div>
        </div>
        `)
    global.document = dom.window.document

    utils.writeInputToLocal()
    const inputDimx = document.getElementById("dimx")
    inputDimx.setAttribute("value",12)
    inputDimx.dispatchEvent(new Event("input", {bubbles: true, composed: true}))
    // utils.testLocalStor#age()
    // inputDimx.
    const cont = document.querySelector("#container")
})

test("that size recommendations work",()=>{

    const width = 200
    const height = 400

    const dom = new JSDOM(
        `
        <div id="container"></div>
        `
    )

    global.document = dom.window.document
    const container = document.querySelector("#container")
    vi.spyOn(container, 'offsetHeight', 'get').mockImplementation(() => height)
    vi.spyOn(container, 'offsetWidth', 'get').mockImplementation(() => width)

    const rec = utils.sizeRecommended()
    expect(rec).toStrictEqual({x: 18, y: 36})

    vi.restoreAllMocks()
})