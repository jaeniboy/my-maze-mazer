import htmlToSvg from "htmlsvg";
import * as exp from "../scripts/exports"

export const download = (container, format) => {
    // remove path elements temporarly
    const innerSquares = [...container.querySelectorAll(".inner-square")]
    innerSquares.map(d=>d.style.display = "none")

    format === "svg" ? exp.downloadSvg(container) : exp.downloadPng(container)
    
    // restore path elements
    innerSquares.map(d=>d.style.display = "block")
}

export const downloadConfig = () => {
    const seed = localStorage.getItem("seed")
    const dimx = localStorage.getItem("select-dimx")
    const dimy = localStorage.getItem("select-dimy")

    return {
        downloadSvg: true,
        filename: `maze_${seed}_${dimx}_x_${dimy}`,
    }
}

export const downloadPng = async (container) => {
    const svgConfig = {
        ...downloadConfig(),
        downloadPng: true,
        convertDataUrl: true,
    }
    const svg = await htmlToSvg(container, svgConfig);
}

export const downloadSvg = async (container) => {
    const svgConfig = downloadConfig()
    const svg = await htmlToSvg(container, svgConfig);
}

