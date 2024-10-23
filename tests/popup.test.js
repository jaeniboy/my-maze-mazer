import {describe, expect, test, vi} from "vitest"
import {generatePlayerListHTML, showPopup, floatToTimeString, addGrading} from "../scripts/popup"
import {JSDOM} from "jsdom"

describe("popup window", () => {

    test("that time string is build from float", () => {
        expect(floatToTimeString(7.1232)).toBe("00:07.12")
        expect(floatToTimeString(66.2898)).toBe("01:06.29")
        expect(floatToTimeString(3601.00)).toBe("60:01.00")
    })

    test("that grading is added correctly",()=> {

        const dom = new JSDOM("<span id='grading'>grading</span>")
        global.document = dom.window.document

        const fakeTimes = [
            8.23, 7.89, 9.56, 6.78, 
            10.12,7.45, 8.67, 9.34
        ]
        addGrading(2.22,fakeTimes)
        expect(document.querySelector("#grading").innerHTML).toBe("pretty good")
        addGrading(8.00,fakeTimes)
        expect(document.querySelector("#grading").innerHTML).toBe("good")
        addGrading(12.22,fakeTimes)
        expect(document.querySelector("#grading").innerHTML).toBe("far from perfect. Try again")
    })

    const dom = new JSDOM(`
        <div id="container">
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="close-button"></div>
                    <div><span id='grading'></span></div>
                    <div class="player-list-container"></div>
                </div>
            </div>
        </div>`)

    global.document = dom.window.document

    test("that players list renders correctly", () => {
        
        const fakeNames = [
            "Luca Rossi", "Sofia Müller", "Aisha Khan", "Mateo Garcia", 
            "Yuki Tanaka", "Anya Ivanova", "Nina Schmidt", "Omar Ahmed"
        ]

        const fakeTimes = [
            8.23, 7.89, 9.56, 6.78, 
            10.12,7.45, 8.67, 9.34
        ]


        expect(generatePlayerListHTML(fakeNames, fakeTimes)).toMatchSnapshot()
    })

    test("that popup gets active", ()=>{

        const fakePlayerTime = 2.22
        const fakeOthersTimes = [1.22,2.23,4.22]
        const dom = new JSDOM(`
            <span id='grading'></span>
            <div class='close-button'></div>
            <div class='player-list-container'></div>
            <div class='popup-overlay'></div>
            `)
        global.document = dom.window.document

        vi.useFakeTimers()
        showPopup(fakePlayerTime,fakeOthersTimes)
        vi.advanceTimersByTime(100)
        expect(document.querySelector(".popup-overlay").style.display).toBe("block")
        expect(document.querySelector(".popup-overlay").classList.contains("active")).toBeTruthy()
    },1200)
    
    test("that popup disappears on close", () => {
        document.querySelector(".close-button").click()
        vi.advanceTimersByTime(300)
        expect(document.querySelector(".popup-overlay").style.display).toBe("none")
        expect(document.querySelector(".popup-overlay").classList.contains("active")).toBeFalsy()
    })

    vi.useRealTimers()

})

