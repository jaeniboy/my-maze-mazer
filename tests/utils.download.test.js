import { test, expect, vi, describe, beforeEach, context } from "vitest";
import * as utils from '../scripts/utils';
import * as exp from "../scripts/exports";
import {JSDOM} from "jsdom"

describe("that click events show and remove download popup",()=>{

    afterEach(()=>{
        vi.restoreAllMocks()
    })

    const dom = new JSDOM(`
        <div class="inner-square"></div>
        <div class="download">
        <i class="bi bi-download"></i>
        <div id="download-popup">
            <i id="download-icon"></i>
            <div id="download-png">PNG</div>
            <div id="download-svg">SVG</div>
        </div>
        <div id="download-popup-overlay">
    </div>`)

    global.document = dom.window.document    
    utils.downloadOptions()
    document.querySelector("#download-icon").click()

    test("that click on download icon shows popup", ()=> {
        const popup = document.querySelector("#download-popup")
        const overlay = document.querySelector("#download-popup-overlay")
        expect(popup.classList.contains("flex")).toBeTruthy()
        expect(overlay.classList.contains("block")).toBeTruthy()
    })

    test("that click on svg starts download and removes popup", () => {
        const spyDownload = vi.spyOn(exp,"download").mockImplementation(()=>{})
        const spyRemoveDownloadPopup = vi.spyOn(utils, "removeDownloadPopup")
        document.querySelector("#download-svg").click()
        expect(spyRemoveDownloadPopup).toHaveBeenCalledTimes(1)
        expect(spyDownload).toHaveBeenCalledWith(null, "svg")
    })

    test("that click on png starts download and removes popup",() => {
        const spyRemoveDownloadPopup = vi.spyOn(utils, "removeDownloadPopup")
        const spyDownload = vi.spyOn(exp,"download").mockImplementation(()=>{})
        document.querySelector("#download-png").click()
        expect(spyRemoveDownloadPopup).toHaveBeenCalledTimes(1)
        expect(spyDownload).toHaveBeenCalledWith(null, "png")
    })

    test("that click on download popup overlay removes popup", () => {
        const spyRemoveDownloadPopup = vi.spyOn(utils, "removeDownloadPopup")
        document.querySelector("#download-popup-overlay").click()
        expect(spyRemoveDownloadPopup).toHaveBeenCalledTimes(1)
    })
    
    // vi.restoreAllMocks()
})

test("add and remove classes to and from download pupup", () => {
    const dom = new JSDOM(
        `
        <div id="container">
            <div id="download-popup"></div>
            <div id="download-popup-overlay"></div>
        </div>
        `
    )

    global.document = dom.window.document

    utils.addDownloadPopup()
    expect(document.querySelector("#download-popup").classList.contains("flex")).toBeTruthy()
    expect(document.querySelector("#download-popup-overlay").classList.contains("block")).toBeTruthy()
    
    utils.removeDownloadPopup()
    expect(document.querySelector("#download-popup").classList.contains("flex")).toBeFalsy()
    expect(document.querySelector("#download-popup-overlay").classList.contains("block")).toBeFalsy()

})