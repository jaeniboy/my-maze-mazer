import { expect, test, describe, vi} from 'vitest'
import Maze from "../scripts/script.js"
import {JSDOM} from "jsdom"

describe("that Maze is instanciated correctly", () => {
    const container = document.createElement("div")
    const seed = "12345"
    let maze = new Maze(10, 10, container, seed)

    test("that instance is present", () => {
        expect(maze).toBeInstanceOf(Maze)
    })

    test("that dimensions are odd values", () => {
        expect(maze.dimx % 2 !== 0 && maze.dimy % 2 !== 0).toBeTruthy()
    })

    test("that seedrandom works correctly", () => {
        const testValues = [
            0.20703519639616447,
            0.6602710883040208,
            0.500949276170095,
            0.8740238761320421,
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
        const seed = "12345"
        let maze = new Maze(10, 10, container, seed)

        const testGrid = [
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","v","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"],
            ["d","s","d","s","d","s","d","s","d","s","d"],
            ["w","d","w","d","w","d","w","d","w","d","w"]
        ]
        expect(maze.makeStep()).toEqual(testGrid)
    })

    const finalTestGrid = [
        ["w","w","w","w","w","w","w","w","w","v","w"],
        ["w","v","v","v","v","v","v","v","v","v","w"],
        ["w","w","w","w","w","w","w","w","w","v","w"],
        ["w","v","v","v","v","v","w","v","v","v","w"],
        ["w","w","w","w","w","v","w","v","w","v","w"],
        ["w","v","v","v","v","v","w","v","w","v","w"],
        ["w","v","w","w","w","w","w","v","w","v","w"],
        ["w","v","w","v","v","v","v","v","w","v","w"],
        ["w","v","w","w","w","w","w","v","w","v","w"],
        ["w","v","v","v","v","v","v","v","w","v","w"],
        ["w","v","w","w","w","w","w","w","w","w","w"]
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
        maze.createFinalGrid()
        const dom = new JSDOM("<!DOCTYPE html><div id='container'></div>").window
        const containerElem = dom.document.getElementById("container")
        containerElem.appendChild(maze.drawMaze())
        expect(containerElem.innerHTML).toMatchSnapshot()
    })

    test("that path is drawn on mousemove",()=>{
        const maze = new Maze(10,10,container,seed)
        maze.createFinalGrid()
        maze.gameMode = true
        const dom = new JSDOM("<!DOCTYPE html><div id='container'></div>").window
        global.document = dom.document
        const containerElem = document.getElementById("container")
        containerElem.appendChild(maze.drawMaze())

        // get squares of path
        const coords = [
            [0,9],
            [1,9],
            [2,9],
            [3,9],
            [3,8],
            [3,7],
            [4,7],
            [5,7],
            [6,7],
            [7,7],
            [8,7],
            [9,7],
            [9,6],
            [9,5],
            [9,4],
            [9,3],
            [9,2],
            [9,1],
            [8,1],
            [7,1],
            [6,1],
            [5,1],
            [5,2],
            [5,3],
        ]

        const squares = coords.map((d)=>{return document.getElementById(`s-${d[0]}-${d[1]}`)})

        squares[0].classList.add("hovered")

        // create rects
        const rects = coords.map(d=>{
            return {
                top: d[0] * 10,
                bottom: d[0] * 10 + 10,
                left: d[1] * 10,
                right: d[1] * 10 + 10
            }
        })

        // mock getBoundingClientRect
        squares.map((d,index)=>{
            vi.spyOn(d, "getBoundingClientRect").mockImplementation(
                () => {return rects[index]}
            )
        })

        // make steps an add classes
        rects.map(d=>maze.drawPath({clientY: d.top + 5, clientX: d.left + 5}))
        const classesAdded = document.getElementsByClassName("hovered").length
        
        // remove classes with mocked event
        rects.toReversed().map(d=>maze.drawPath({clientY: d.top + 5, clientX: d.left + 5}))
        const classesRemoved = classesAdded - document.getElementsByClassName("hovered").length

        expect(classesAdded).toBe(24)
        expect(classesRemoved).toBe(23)
    })

    test("that function is called on win",()=>{

        const maze = new Maze(10,10,container,seed)
        maze.createFinalGrid()
        maze.gameMode = true
        // maze.lastHovered = [9,1]
        maze.playerPath = [[9,3],[9,2],[9,1]]

        const dom = new JSDOM("<!DOCTYPE html><div id='container'></div>").window
        global.document = dom.document
        const containerElem = document.getElementById("container")
        containerElem.appendChild(maze.drawMaze())
        // get last three squares
        const squares = [
            document.getElementById("s-9-2"),
            document.getElementById("s-9-1"),
            document.getElementById("s-10-1")
        ]
        squares[0].classList.add("hovered")
        squares[1].classList.add("hovered")
        // create rects
        const rects = [
            {top:90,bottom:100,left:20,right:30},
            {top:90,bottom:100,left:10,right:20},
            {top:100,bottom:110,left:10,right:20}
        ]
        // mock getBoundingClientRect
        squares.map((d,index)=>{
            vi.spyOn(d, "getBoundingClientRect").mockImplementation(
                () => {return rects[index]}
            )
        })

        // mock functions
        const solved = vi.spyOn(maze,"solved").mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        
        // add classes with mocked event 
        const event = {clientX: 15, clientY: 105}
        maze.drawPath(event)
        maze.drawPath(event)
        
        expect(solved).toHaveBeenCalled()
        expect(maze.gameMode).toBeFalsy()

    })

    test("that animate function results in game mode", ()=>{
        const maze = new Maze(10,10,container,seed)
        const spy = vi.spyOn(maze, "setEntryFieldHovered").mockImplementation(()=>{})
        vi.spyOn(maze, "addToContainer").mockImplementation(()=>{})
        maze.gameMode = false

        // skip actual animation steps due to timeouts
        maze.createFinalGrid()

        vi.spyOn(maze, "makeStep").mockImplementation(()=>{
            maze.countdown--
        })
        maze.countdown = 0
        maze.animate()
        setTimeout(()=>{
            expect(spy).toBeCalled()
            expect(maze.gameMode).toBeTruthy()
        }, maze.animationInterval)
    })

    test("that html is added to container", () => {

        // setup
        const dom = new JSDOM("<!DOCTYPE html><div id='container'><div>Old Stuff</div></div>")
        global.document = dom.window.document
        const containerElem = document.getElementById("container")
        const maze = new Maze(10,10,containerElem,seed)

        // Mocks
        const appendChildSpy = vi.spyOn(containerElem, "appendChild").mockImplementation((d)=>{})
        const innerHTMLSpy = vi.spyOn(containerElem, "innerHTML", "set")

        // funcs
        maze.addToContainer()

        // results
        expect(innerHTMLSpy).toBeCalledWith("")
        expect(appendChildSpy).toBeCalled()
    })

    test("that entry field is set to hovered",() => {
        const dom = new JSDOM("<!DOCTYPE html><div id='container'><div id='entry-field'>entry field</div></div>")
        global.document = dom.window.document
        const maze = new Maze(10,10,container,seed)
        maze.entryFieldID = "entry-field"
        maze.setEntryFieldHovered()
        expect(document.getElementById("entry-field").classList.contains("hovered")).toBeTruthy()

    })

    test("that coords from event return properly",()=>{
        const touchmoveEvent = {
            type: "touchmove",
            touches: [
                {clientX: 0, clientY: 1}
            ]
        }

        const mousemoveEvent = {
            type: "mousemove",
            clientX: 0,
            clientY: 1
        }

        expect(maze.getCoordsFromEvent(touchmoveEvent)[0]).toBe(0)
        expect(maze.getCoordsFromEvent(touchmoveEvent)[1]).toBe(1)
        expect(maze.getCoordsFromEvent(mousemoveEvent)[0]).toBe(0)
        expect(maze.getCoordsFromEvent(mousemoveEvent)[1]).toBe(1)
    })

    const fixedTests = [
        [10, "1234"],
        [20, "Apfelbaum"],
        [30, "12121212"],
        [40, "foobar"],
        [21, "9732"]
    ]

    const randomTests = [...Array(10)].map(() => {
        return [
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 10000).toString()
        ]
    }).filter(d => d[0] >= 10 && d[1].length >= 1)

    test.each([...fixedTests,...randomTests])("that exit is far away from entry with dimx %i and seed %s",(dimx, seed)=>{
        const maze = new Maze(dimx,20,container,seed)
        maze.createFinalGrid()
        maze.addToContainer()
        const rows = container.getElementsByClassName("row")
        const entry = rows[0].querySelector(".v").id
        const entryY = entry.split("-")[2]
        const exit = [...rows].slice(-1)[0].querySelector(".v").id
        const exitY = exit.split("-")[2]
        const testValue = (maze.dimx - 1) - entryY
        expect([testValue - 1, testValue, testValue + 1]).toContain(Number(exitY))
    })
})

