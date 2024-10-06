import Maze from "./scripts/script.js"
import { applySquareSize } from "./scripts/utils.js"

const container = document.getElementById("container")
const dimx = 7
const dimy = 7
const maze = new Maze(dimx, dimy, container, 12345)
applySquareSize(dimx, dimy, container)

maze.addToContainer()
maze.createFinalGrid()
maze.addToContainer()

document.getElementById("create").onclick = function () {
  maze.animate()
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

if (touch_enabled()) {
  document.ontouchmove = function (e) { maze.drawPath(e) }
} else {
  document.onmousemove = function (e) { maze.drawPath(e) }
}