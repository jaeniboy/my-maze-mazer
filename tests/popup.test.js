import {describe, expect, test, vi} from "vitest"
import {generatePlayerListHTML, showPopup} from "../scripts/popup"
import {JSDOM} from "jsdom"

describe("popup window", () => {

    const dom = new JSDOM(`
        <div id="container">
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="close-button">
                    <div class="player-list-container"></div>
                </div>
            </div>
        </div>`)

    global.document = dom.window.document

    test("that players list renders correctly", () => {
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
        expect(generatePlayerListHTML(fakePlayers)).toMatchSnapshot()
    })

    test("that popup gets active", ()=>{
        vi.useFakeTimers()
        showPopup()
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

