import Maze from "./scripts/script.js"

const container = document.getElementById("container")
//const maze = new Maze(7,7, container)
const maze = new Maze(10,10, container, 12345)
maze.addToContainer()

document.getElementById("create").onclick = function(){
  maze.animate()
}

function touch_enabled() {
    return ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );
}

//document.onmousemove = function (e) {console.log(e.clientX,e.clientY)}
if(touch_enabled()) {
  document.ontouchmove = function(e) { maze.drawPath(e)}
} else {
  document.onmousemove = function(e) { maze.drawPath(e)}
}