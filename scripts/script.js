class Maze {

    constructor(dimx,dimy,container) {
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
        this.playerPath = []
        this.countdown = ((this.dimy - 1)/2)*((this.dimx - 1)/2)
        this.container = container
        this.animationID
        this.random = new Math.seedrandom("1234")
    }

    getRand(arr) {
        return arr[Math.floor(this.random()*arr.length)]
        // return arr[Math.floor(Math.random()*arr.length)]
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
            //clearInterval(this.AnimationID)
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
        const top = this.grid[0].map((d,i)=>{return this.grid[1][i] === "v" ? [0,i] : []}).filter(d=>d.length > 0)
        const bottom = this.grid[this.dimy-1].map((d,i)=>{return this.grid[this.dimy-2][i] === "v" ? [this.dimy-1,i] : []}).filter(d=>d.length > 0)

        const topExit = this.getRand(top)
        const bottomExit = this.getRand(bottom)

        this.grid[topExit[0]][topExit[1]] = "v"
        this.grid[bottomExit[0]][bottomExit[1]] = "v"
        
        this.entryField = topExit
        // this.playerPath.push(topExit)        
    }

    drawMaze() {

        const elem = document.createElement("div")

        for (let [rowindex,row] of this.grid.entries()) {
            let rowDiv = document.createElement("div")
            rowDiv.className = "row"
            for (let [colindex, value] of row.entries()) {
                let square = document.createElement("div")
                square.innerText = value
                square.className = value + " square"
                square.setAttribute("data-y", rowindex)
                square.setAttribute("data-x", colindex)
                square.onmouseover = (e) => {
                    this.gameFuncs(e)
                }
                if (rowindex === this.entryField[0] && colindex === this.entryField[1]) {
                    this.playerPath.push(square)
                }
                rowDiv.appendChild(square)
            }

            elem.appendChild(rowDiv)
        }
        return elem
    }
    gameFuncs(e) {
        // PlayerMode here 
        const val = e.target.innerText
        const coords = this.getCoordsFromSquare(e.target)//[Number(e.target.getAttribute("data-y")),Number(e.target.getAttribute("data-x"))]
        const neighbours = [
            [coords[0]-1,coords[1]],
            [coords[0],coords[1]+1],
            [coords[0]+1,coords[1]],
            [coords[0],coords[1]-1]
        ]
        const lastVisited = this.playerPath.slice(-1)[0]
        const lastVisitedCoords = this.getCoordsFromSquare(lastVisited)//[Number(lastVisited.getAttribute("data-y")]
        const scndLastVisited = this.playerPath.slice(-2)[0]
        console.log("scndLastVisited", scndLastVisited)
        if (this.countdown === -1 && val === "v") { // check if game mode and not wall
            if (
                JSON.stringify(neighbours).includes(JSON.stringify(lastVisitedCoords)) || // check if a neighbour was currently hovered
                JSON.stringify(coords) === JSON.stringify(lastVisitedCoords)
            ) {
                e.target.classList.add("hovered")
                this.playerPath.push(e.target)
            } else if (
                e.target === scndLastVisited
            ) {
                console.log("scndlastVisited")
            }
        }
    }

    getCoordsFromSquare(elem) {
        return [Number(elem.getAttribute("data-y")),Number(elem.getAttribute("data-x"))]
    }
    
    addToContainer() {
        this.container.innerHTML = ""
        this.container.appendChild(this.drawMaze())
    }
    
    animate() {
        if (this.countdown < 0) {
            alert("done")
        } else {
        setTimeout(()=>{
            //!this.activeField ? this.setInitialField() : this.makeStep()
            this.makeStep()
            console.log("running")
            this.addToContainer()
            this.animate()
        },this.animationInterval)
        }
    }

}
