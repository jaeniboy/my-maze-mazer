class Maze {
    
    constructor(dimx,dimy) {
        this.dimx = dimx
        this.dimy = dimy
        this.spaceField = "s"
        this.wallField = "w"
        this.doorField = "d"
        this.grid = this.createGrid()
        this.activeField 
    }
    
    getRand(arr) {
        return arr[Math.floor(Math.random()*arr.length)]
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
        this.grid[index[0]][index[1]] = "v"
        
        return this.grid
    }
    
    checkNeighbours(coords) {
        const fields = []
        //const moves = [[-2,0],[0,2],[2,0],[0,-2]]
        //for (let i = 0; i < moves.length; i++) {
        //    if 
        //}
        const neighbours = [
            [coords[0]-2,coords[1]],
            [coords[0],coords[1]+2],
            [coords[0]+2,coords[1]],
            [coords[0],coords[1]-2]
        ]
        console.log("unfitered", neighbours)
        
        return neighbours.filter((d) => {return d !== "undefined" && this.grid[d[0]][d[1]] === "s"})
    }
    
    makeStep() {
        /*
        const neighbours = [
            [this.activeField[0]-2,this.activeField[1]],
            [this.activeField[0],this.activeField[1]+2],
            [this.activeField[0]+2,this.activeField[1]],
            [this.activeField[0],this.activeField[1]-2]
        ]
        */
        const neighbours = this.checkNeighbours(this.activeField)
        const nextField = this.getRand(neighbours)
        console.log(nextField)
        this.grid[nextField[0]][nextField[1]] = "v"
        this.activeField = nextField
        return this.grid
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
    
    logVariables() {
        /* debugging here */
        
        //console.log(this.setInitialField())
    }
}
