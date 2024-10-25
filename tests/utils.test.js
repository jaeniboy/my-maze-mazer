import { test, expect, vi, describe, afterAll } from "vitest";
import { maxSquareSize, applySquareSize, renderSetupPage, startGame} from "../scripts/utils";
import * as utils from '../scripts/utils';
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
    utils.renderSetupPage(container)

    test("that input fields exist",()=>{
        const inputs = container.getElementsByTagName("input")
        expect(inputs.length).toBe(3)
        const inputIDs = [...inputs].map(d=>d.id)
        expect(inputIDs).toEqual(["dimx", "dimy", "seed"])
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
            <input id="dimx" value="${x}">
            <input id="dimy" value="${y}">
            <input id="seed" value="1234">        
        </div>
        <div id="footer">
            <div class="backwards"></div>
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

    const dom = new JSDOM("<div id='timer-container'>dummy</div>")
    global.document = dom.window.document
    const timerContainer = document.getElementById("timer-container")

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
        expect(timerContainer.innerText).toBe("00:00.51")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("00:02.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("00:02.51")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("00:20.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("03:20.00")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("20:34.57")
        vi.advanceTimersToNextTimer()
        expect(timerContainer.innerText).toBe("100:00.00")

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
