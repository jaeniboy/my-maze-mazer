class Maze {
    
    constructor(dimx,dimy) {
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
        this.countdown = ((this.dimy - 1)/2)*((this.dimx - 1)/2)
    }
    
    getRand(arr) {
        return arr[Math.floor(Math.random()*arr.length)]
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
        } else {
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
                    console.log("countdown",this.countdown)
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
        console.log(this.grid)
    }
    
    drawMaze() {
        
        const elem = document.createElement("div")
    
        for (let row of this.grid) {
            let rowDiv = document.createElement("div")
            rowDiv.className = "row"
            for (let value of row) {
                let square = document.createElement("div")
                square.innerText = value
                square.className = value + " square"
                rowDiv.appendChild(square)
            }
        
            elem.appendChild(rowDiv)
        }
        return elem
    }
    
}
