import seedrandom from "seedrandom"
import confetti from "canvas-confetti"
import { timerID, timeToSolve } from "../scripts/utils";
import { showPopup} from "./popup";
import {chart, getDistributionFromData, getSecondsFromTimeString, shiftTimeValues} from "./chart"
import {times} from "../data/players"

class Maze {

    constructor(dimx,dimy,container,seed="hello world") {
        this.dimx = dimx
        if (this.dimx % 2 === 0) {this.dimx = this.dimx + 1}
        this.dimy = dimy 
        if (this.dimy % 2 === 0) {this.dimy = this.dimy + 1}
        this.spaceField = "s"
        this.wallField = "w"
        this.doorField = "d"
        this.grid = this.createGrid()
        this.activeField 
        this.path = []
        this.entryField = []
        this.entryFieldID = ""
        this.exitField = []
        this.exitFieldID = ""
        this.playerPath = []
        this.countdown = ((this.dimy - 1)/2)*((this.dimx - 1)/2)
        this.container = container
        this.random = seedrandom(seed)
        this.animationInterval = 1
        this.lastHovered
        this.gameMode = false
    }

    getRand(arr) {
        return arr[Math.floor(this.random()*arr.length)]
    }

    getDoorField(coord1, coord2) {
        let y = Math.max(coord1[0],coord2[0]) - Math.abs(coord1[0] - coord2[0])
        let x = Math.max(coord1[1],coord2[1]) - Math.abs(coord1[1] - coord2[1])

        Math.abs(coord1[0] - coord2[0]) !==0 && y++
        Math.abs(coord1[1] - coord2[1]) !==0 && x++

        return [y,x]
    }

    createRow(firstSign,secondSign) {
        const arr = new Array(this.dimx).fill(secondSign)
        for (let i =0; i<this.dimx;i++) {
             if (i % 2 === 0) {
                 arr[i] = firstSign
             }
        }
       return arr
    }

    createGrid() {
        const arrY = new Array(this.dimy).fill([])
        for (let i = 0; i < this.dimy; i++) {
            if (i % 2 ===0) {
                arrY[i] = this.createRow(this.wallField,this.doorField,this.dimx)
            } else {
                arrY[i] = this.createRow(this.doorField,this.spaceField,this.dimx)
            }
        }
        return arrY
    }

    setInitialField() {
        let indices = []
        for (let i =0; i<this.grid.length;i++) {
            for (let j=0; j<this.grid[i].length;j++) {
                let value = this.grid[i][j]
                if (value === "s") {
                    indices.push([i,j])
                }
            }
        }

        const index = this.getRand(indices)
        this.activeField = index
        this.path.push(index)
        this.grid[index[0]][index[1]] = "v"
        this.countdown--

        return this.grid
    }

    checkNeighbours(coords, dimx, dimy) {
        const neighbours = []

        // check for dimensions
        coords[0]-2 >= 0 && neighbours.push([coords[0]-2,coords[1]])
        coords[1]+2 < dimx && neighbours.push([coords[0],coords[1]+2])
        coords[0]+2 < dimy && neighbours.push([coords[0]+2,coords[1]])
        coords[1]-2 >= 0 && neighbours.push([coords[0],coords[1]-2])

        return neighbours.filter((d) => {return this.grid[d[0]][d[1]] === "s"})
    }

    makeStep() {
        if (this.countdown === 0) {
            this.buildWalls()
            this.countdown--
        } else if (this.countdown > 0) {
            if (!this.activeField) {
                this.setInitialField()
            } else {
                const neighbours = this.checkNeighbours(this.activeField, this.dimx, this.dimy)
                if (neighbours.length > 0) {
                    const nextField = this.getRand(neighbours)
                    const doorField = this.getDoorField(this.activeField,nextField)
                    this.grid[doorField[0]][doorField[1]] = "v"
                    this.grid[nextField[0]][nextField[1]] = "v"
                    this.activeField = nextField
                    this.path.push(nextField)
                    this.countdown--
                } else {
                    this.activeField = this.path.pop()
                    this.makeStep()
                }
            }
        }

        return this.grid
    }

    buildWalls() {
        this.grid = this.grid.map(row=>row.map(d=>d==="d"?"w":d))
        this.setExitPoints()
    }

    setExitPoints() {

        // check which walls are next to paths
        const top = this.grid[0].map((d,i)=>{return this.grid[1][i] === "v" ? [0,i] : []}).filter(d=>d.length > 0)
        const bottom = this.grid[this.dimy-1].map((d,i)=>{return this.grid[this.dimy-2][i] === "v" ? [this.dimy-1,i] : []}).filter(d=>d.length > 0)
        

        const topExit = this.getRand(top)
        const bottomExit = this.getRand(bottom)
        const bottomExitTemp = (this.dimx-1) - topExit[1]
        const bottomExitTempNeighbour = this.grid[this.dimy-2][bottomExitTemp]
        let bottomExitX
        if (bottomExitTempNeighbour !== "v") {
            bottomExitX = bottomExitTemp >= topExit[1] ? bottomExitTemp + 1 : bottomExitTemp - 1
        } else {
            bottomExitX = bottomExitTemp
        }

        this.grid[topExit[0]][topExit[1]] = "v"
        this.grid[this.dimy-1][bottomExitX] = "v"
        // this.grid[bottomExit[0]][bottomExit[1]] = "v"
        
        this.entryField = topExit
        // this.lastHovered = topExit
        this.playerPath.push(this.entryField)
        this.entryFieldID = `s-${topExit[0]}-${topExit[1]}`
        this.exitFieldID = `s-${[this.dimy-1]}-${bottomExitX}`
    
    }

    createFinalGrid() {
        if (this.countdown >= 0) {
            this.makeStep()
            this.createFinalGrid()
        }
    }

    drawMaze() {

        const elem = document.createElement("div")

        for (let [rowindex,row] of this.grid.entries()) {
            let rowDiv = document.createElement("div")
            rowDiv.className = "row"
            for (let [colindex, value] of row.entries()) {
                let square = document.createElement("div")
                square.className = value + " square"
                square.id = "s-" + rowindex + "-" + colindex
                square.setAttribute("data-y", rowindex)
                square.setAttribute("data-x", colindex)

                let innerSquare = document.createElement("div")
                innerSquare.className = "inner-square"
                square.appendChild(innerSquare)
                rowDiv.appendChild(square)
            }

            elem.appendChild(rowDiv)
        }
        return elem
    }
    
    drawPath(event) {
        if (this.gameMode) {

            // prevents signing two fields as visited at the same time
            let nothingHoverd = true

            // remove all "lost" fields except entry field
            const hoveredFields = [...document.getElementsByClassName("hovered")]
            const lostFields = hoveredFields.filter(d=>!this.hasHoveredNeighbours(d) && d.id !== this.entryFieldID)
            if (lostFields.length > 0) {
                lostFields.map(d=>d.classList.remove("hovered"))
                this.playerPath.pop()
            }

            // get ID of last hoverd field
            const lastHovered = this.playerPath.slice(-1)[0]
            const last = document.getElementById("s-"+lastHovered[0]+"-"+lastHovered[1])

            // get all border values t, b, l, r
            const top = last.getBoundingClientRect().top
            const bottom = last.getBoundingClientRect().bottom
            const left = last.getBoundingClientRect().left
            const right = last.getBoundingClientRect().right
            
            // get all neighbours n, e, s, w
            const north = document.getElementById("s-"+ (lastHovered[0]-1) +"-"+ lastHovered[1])
            const east = document.getElementById("s-"+ (lastHovered[0]) +"-"+ (lastHovered[1]+1))
            const south = document.getElementById("s-"+ (lastHovered[0]+1) +"-"+ lastHovered[1])
            const west = document.getElementById("s-"+ (lastHovered[0]) +"-"+ (lastHovered[1]-1))
              
            // get coordinate of event
            const clientX = this.getCoordsFromEvent(event)[0]
            const clientY = this.getCoordsFromEvent(event)[1]
            
            if (last.id === this.exitFieldID) {
                this.solved()
                this.gameMode = false
            } 
            
            // check the north
            if (clientY < top && north && nothingHoverd) {
                if (north.classList.contains("v") && !north.classList.contains("hovered")) {
                    north.classList.add("hovered")
                    this.playerPath.push(this.getCoordsFromSquare(north))
                    nothingHoverd = false
                } else if (north.classList.contains("hovered")) {
                    last.classList.remove("hovered")
                    this.playerPath.pop()
                }
            }
            
            // check the south
            if (clientY > bottom && nothingHoverd) {
                if (south.classList.contains("v") && !south.classList.contains("hovered")) {
                    south.classList.add("hovered")
                    this.playerPath.push(this.getCoordsFromSquare(south))
                    nothingHoverd = false
                } else if (south.classList.contains("hovered")) {
                    last.classList.remove("hovered")
                    this.playerPath.pop()
                }
            }
            
            // check the west
            if (clientX < left && nothingHoverd) {
                if (west.classList.contains("v") && !west.classList.contains("hovered")) {
                    west.classList.add("hovered")
                    this.playerPath.push(this.getCoordsFromSquare(west))
                    nothingHoverd = false
                } else if (west.classList.contains("hovered")) {
                    last.classList.remove("hovered")
                    this.playerPath.pop()
                }
            }
                
            // check the east
            if (clientX > right && nothingHoverd) {
                if (east.classList.contains("v") && !east.classList.contains("hovered")) {
                    east.classList.add("hovered")
                    this.playerPath.push(this.getCoordsFromSquare(east))
                    nothingHoverd = false
                } else if (east.classList.contains("hovered")) {
                    last.classList.remove("hovered")
                    this.playerPath.pop()
                }
            }

        }
      
    }

    getCoordsFromEvent(event) {
        // get coordinate of event
        const clientX = event.type === "touchmove" ? event.touches[0].clientX : event.clientX
        const clientY = event.type === "touchmove" ? event.touches[0].clientY : event.clientY
        return[clientX,clientY]
    }

    hasHoveredNeighbours(elem) {

        const coords = [Number(elem.getAttribute("data-y")), Number(elem.getAttribute("data-x"))]
        const neighbourIDs = [
            "s-"+ (coords[0]-1) +"-"+ coords[1],
            "s-"+ coords[0] +"-"+ (coords[1]+1),
            "s-"+ (coords[0]+1) +"-"+ coords[1],
            "s-"+ coords[0] +"-"+ (coords[1]-1),
        ]

        const neighbours = neighbourIDs.map(d=> document.getElementById(d)).filter(x => x)
        return neighbours.some(d=>d.classList.contains("hovered"))
    }

    getCoordsFromSquare(elem) {
        return [Number(elem.getAttribute("data-y")),Number(elem.getAttribute("data-x"))]
    }
    
    addToContainer() {
        this.container.innerHTML = ""
        this.container.appendChild(this.drawMaze())
    }
    
    animate() {
        if (this.countdown >= 0) {
            setTimeout(()=>{
                this.makeStep()
                this.addToContainer()
                this.animate()
            },this.animationInterval)
        } else {
            // document.getElementById(this.entryFieldID).classList.add("hovered")
            this.setEntryFieldHovered()
            this.gameMode = true
        }
    }

    setEntryFieldHovered() {
        document.getElementById(this.entryFieldID).classList.add("hovered")
    }

    solved() {
        confetti({
            origin: { y: 1 },
            colors: ["#55757e","#aa5a4e"],
            spread: 80
        })
        setTimeout(()=>{
            document.getElementById("result").innerText = timeToSolve

            const playerTime = getSecondsFromTimeString(timeToSolve)
            const shiftedTimes = shiftTimeValues(playerTime, times)
            const playersDist = getDistributionFromData(playerTime,shiftedTimes)//playersData)
            chart(playerTime,playersDist)
            showPopup(playerTime,shiftedTimes)
        }, 1000)
        clearInterval(timerID)
    }

}

// module.exports = Maze
export default Maze
