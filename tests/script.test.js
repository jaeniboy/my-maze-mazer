import { expect, test, describe, vi} from 'vitest'
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
        // get first three squares
        const squares = [
            document.getElementById("s-0-2"),
            document.getElementById("s-1-2"),
            document.getElementById("s-1-3"),
            document.getElementById("s-1-4")
        ]
        squares[0].classList.add("hovered")
        // create rects
        const rects = [
            {top:10,bottom:20,left:20,right:30},
            {top:20,bottom:30,left:20,right:30},
            {top:20,bottom:30,left:30,right:40},
            {top:20,bottom:30,left:40,right:50},
        ]
        // mock getBoundingClientRect
        squares.map((d,index)=>{
            vi.spyOn(d, "getBoundingClientRect").mockImplementation(
                () => {return rects[index]}
            )
        })
        // add classes with mocked event 
        const event = {clientX: 45, clientY: 25}
        maze.drawPath(event)
        maze.drawPath(event)
        maze.drawPath(event)
        const classesAdded = document.getElementsByClassName("hovered").length

        // remove classes with mocked event
        const removeEvent = {clientX: 25, clientY: 25}
        maze.drawPath(removeEvent)
        maze.drawPath(removeEvent)
        const classesRemoved = classesAdded - document.getElementsByClassName("hovered").length
        
        expect(classesAdded).toBe(4)
        expect(classesRemoved).toBe(2)
    })

    test("that function is called on win",()=>{

        const maze = new Maze(10,10,container,seed)
        maze.createFinalGrid()
        maze.gameMode = true
        maze.lastHovered = [9,2]

        const dom = new JSDOM("<!DOCTYPE html><div id='container'></div>").window
        global.document = dom.document
        const containerElem = document.getElementById("container")
        containerElem.appendChild(maze.drawMaze())
        // get last three squares
        const squares = [
            document.getElementById("s-9-1"),
            document.getElementById("s-9-2"),
            document.getElementById("s-10-2")
        ]
        squares[0].classList.add("hovered")
        squares[1].classList.add("hovered")
        // create rects
        const rects = [
            {top:100,bottom:110,left:10,right:20},
            {top:100,bottom:110,left:20,right:30},
            {top:110,bottom:120,left:20,right:30}
        ]
        // mock getBoundingClientRect
        squares.map((d,index)=>{
            vi.spyOn(d, "getBoundingClientRect").mockImplementation(
                () => {return rects[index]}
            )
        })

        // mock functions
        const solved = vi.spyOn(maze,"solved")
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        
        // add classes with mocked event 
        const event = {clientX: 25, clientY: 115}
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
            console.log(maze.countdown)
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
})

