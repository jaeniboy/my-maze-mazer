import { expect, test, describe} from 'vitest'
import Maze from "../scripts/script.js"
import {JSDOM} from "jsdom"

describe("that Maze is instanciated correctly", () => {
    const container = document.createElement("div")
    const seed = 12345
    let maze = new Maze(10, 10, container, seed)

    test("that instance is present", () => {
        expect(maze).toBeInstanceOf(Maze)
    })

    test("that dimensions are odd values", () => {
        expect(maze.dimx % 2 !== 0 && maze.dimy % 2 !== 0).toBeTruthy()
    })

    test("that seedrandom works correctly", () => {
        const testValues = [
            0.9166586073672581,
            0.033239555014046934,
            0.8161255028800786,
            0.5355104187079619
        ]
        const randValues = [
            maze.random(),
            maze.random(),
            maze.random(),
            maze.random()
        ]
        expect(randValues).toEqual(testValues)
    })

    test("that initial grid is constructed correctly", () => {
        const testGrid = [
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"]
        ]
        expect(maze.grid).toEqual(testGrid)
    })

    test("that first step is constructed correctly",()=>{
        const testGrid = [
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","v","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"]
        ]
        expect(maze.makeStep()).toEqual(testGrid)
    })

    const finalTestGrid = [
        ["w","w","v","w","w","w","w","w","w","w","w"],
        ["w","v","v","v","v","v","v","v","v","v","w"],
        ["w","v","w","w","w","v","w","w","w","w","w"],
        ["w","v","v","v","w","v","v","v","v","v","w"],
        ["w","w","w","w","w","w","w","w","w","v","w"],
        ["w","v","v","v","v","v","v","v","w","v","w"],
        ["w","v","w","w","w","w","w","v","w","v","w"],
        ["w","v","w","v","v","v","w","v","v","v","w"],
        ["w","v","w","v","w","v","w","w","w","v","w"],
        ["w","v","v","v","w","v","w","v","v","v","w"],
        ["w","w","v","w","w","w","w","w","w","w","w"]
      ]

    test("that final grid is constructed correctly",()=>{
        const maze = new Maze(10,10,container,seed)
        maze.createFinalGrid()
        expect(maze.grid).toEqual(finalTestGrid)
    })

    test("that final grid ist constructed correctly after some steps", ()=>{
        const maze = new Maze(10,10,container, seed)
        maze.makeStep()
        maze.makeStep()
        maze.makeStep()
        maze.createFinalGrid()
        expect(maze.grid).toEqual(finalTestGrid)
    })

    test("that html renders correctly",()=>{
        const maze = new Maze(10,10,container,seed)
        const dom = new JSDOM("<!DOCTYPE html><div id='container'></div>").window
        const containerElem = dom.document.getElementById("container")
        containerElem.appendChild(maze.drawMaze())
        console.log(containerElem.innerHTML)
    })
})