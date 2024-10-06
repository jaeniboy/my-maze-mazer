import Maze from "../scripts/script"
import * as utils from "../scripts/utils"

export const maxSquareSize = (dimx,dimy,container) => {
    const x = dimx % 2 === 0 ? dimx + 1 : dimx
    const y = dimy % 2 === 0 ? dimy + 1 : dimy
    return Math.floor(Math.min(
      container.offsetWidth / x - 0.5,
      container.offsetHeight / y - 0.5
    ))
  }

export const applySquareSize = (dimx, dimy, container) => {
  // compute square size
  // const size = maxSquareSize(dimx,dimy,container)
  const size = utils.maxSquareSize(dimx,dimy,container)
  // get last style sheet in list
  const sheet = [...document.styleSheets].slice(-1)[0]
  // remove rule if already present
  sheet.cssRules[0].selectorText === ".square" &&  sheet.deleteRule(0)
  // add new rule with computed square size values
  sheet.insertRule(`.square {width:${size}px; height:${size}px}`,0)
}

export const renderSetupPage = (container, defaults={x:20, y:30, seed:1234}) => {

  const div = document.createElement("div")
  div.id = "setup-container"
  div.innerHTML = 
  `
  <label for="dimx">Anzahl x:</label>
  <input type="text" id="dimx" name="x" value="${defaults.x}">
  <label for="dimy">Anzahl y:</label>
  <input type="text" id="dimy" name="y" value="${defaults.y}">
  <label for="seed">Seed:</label>
  <input type="text" id="seed" name="seed" value="${defaults.seed}">
  `

  const button = document.createElement("button")
  button.id = "start-game-button"
  button.innerText = "Start Game"
  // button.onclick = ()=> startGame(container)
  button.onclick = ()=> utils.startGame(container)
  div.appendChild(button)
  container.appendChild(div)
}

export const startGame = (container) => {
  // ...
  const dimx = Number(document.getElementById("dimx").value)
  const dimy = Number(document.getElementById("dimy").value)
  const seed = document.getElementById("seed").value
  const maze = new Maze(dimx, dimy, container, seed)
  maze.createFinalGrid()
  maze.addToContainer()
  // applySquareSize(dimx, dimy, container)
  utils.applySquareSize(dimx, dimy, container)

  // set size of square based on screen width 
  // and height and make it responsive
  window.onresize = () => {
    utils.applySquareSize(dimx, dimy, container)
  }

  maze.setEntryFieldHovered()
  maze.gameMode = true

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

}