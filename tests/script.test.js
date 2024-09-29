// const seedrandom = require('seedrandom');
// const Maze = require("../scripts/script")#
import { expect, test, describe } from 'vitest'
import Maze from "../scripts/script.js"

describe("that Maze is instanciated correctly", () => {
    const container = document.createElement("div")
    const seed = 12345
    const maze = new Maze(10, 10, container, seed)

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
})