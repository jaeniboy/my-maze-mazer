import Maze from "./scripts/script.js"
import { applySquareSize } from "./scripts/utils.js"

const container = document.getElementById("container")
const dimx = 10
const dimy = 10
const maze = new Maze(dimx, dimy, container, 12345)
applySquareSize(dimx, dimy, container)

maze.addToContainer()

document.getElementById("create").onclick = function () {
  // maze.animate()
  maze.createFinalGrid()
  maze.addToContainer()
  const squares = [...document.getElementsByClassName("square")]
  squares.map(d=>d.classList.add("invisible"))

  const rows = [...document.getElementsByClassName("row")]
  let stop = rows.length
  let i = 0

  const fadeIn = (i) => {
    if (i < stop) {
      setTimeout(()=>{
        const rowsquares = [...rows[i].getElementsByClassName("square")]
        rowsquares.map(d=>{
          d.classList.remove("invisible")
          d.classList.add("visible")
        })
        i++
        fadeIn(i)
      },50)
    }
  }

  fadeIn(i)

}



// set size of square based on screen width 
// and height and make it responsive
window.onresize = () => {
  applySquareSize(dimx, dimy, container)
}

function touch_enabled() {
  return ('ontouchstart' in window) ||
    // (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

console.log(touch_enabled())

if (touch_enabled()) {
  document.ontouchmove = function (e) { maze.drawPath(e) }
} else {
  document.onmousemove = function (e) { maze.drawPath(e) }
}
// document.onmousemove = function (e) { maze.drawPath(e) }