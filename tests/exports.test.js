import * as exp from "../scripts/exports"
import {vi, test, expect, afterEach} from "vitest"
import {JSDOM} from "jsdom"
import {htmlToSvg} from "htmlsvg"

describe("maze export options", () => {

    afterEach(()=>{
            vi.restoreAllMocks()
        }
    )

    test("that downloads are called correctly", ()=>{
        const dom = new JSDOM(`
                <div id="inner-square"></div>
            `)
    
        global.document = dom.window.document
    
        const sypDownloadSvg = vi.spyOn(exp,"downloadSvg").mockImplementation(()=>{})
        const sypDownloadPng = vi.spyOn(exp,"downloadPng").mockImplementation(()=>{})
        const container = document.querySelector("body")
    
        exp.download(container, "svg")
        expect(sypDownloadSvg).toHaveBeenCalled()
        exp.download(container, "png")
        expect(sypDownloadPng).toHaveBeenCalled()
    })

    test("that download config is returned correctly", ()=>{
        vi.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(JSON.stringify(1234))
            .mockReturnValueOnce(JSON.stringify(10))
            .mockReturnValueOnce(JSON.stringify(20))        
        const downloadCnfg = exp.downloadConfig()
        expect(downloadCnfg).toStrictEqual({ downloadSvg: true, filename: 'maze_1234_10_x_20' })
    })

    test.todo("that svg download is called correctly", ()=>{ 
        //trouble with importing htmlsvg
        const dom = new JSDOM(`
            <div id="inner-square"></div>
        `)

        global.document = dom.window.document
        const container = document.querySelector("body")
        const spyHtmlToSvg = vi.spyOn(htmlsvg,"htmlToSvg")

        exp.downloadPng(container)
        expect(spyDownloadPng)
    })

    test.todo("that png download is called correctly", ()=>{ 
        //trouble with importing htmlsvg
    })

})


