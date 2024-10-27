import Maze from "../scripts/script"
import * as utils from "../scripts/utils"
import { gameChart } from "./chart"

export let timerID
export let timeToSolve

export const maxSquareSize = (dimx, dimy, container) => {
  const x = dimx % 2 === 0 ? dimx + 1 : dimx
  const y = dimy % 2 === 0 ? dimy + 1 : dimy
  return Math.floor(Math.min(
    container.offsetWidth / x - 0.5,
    container.offsetHeight / y - 0.5
  ))
}

export const sizeRecommended = () => {
  const container = document.querySelector("#container")
  const numX = Math.floor(container.offsetWidth / 11)
  const numY = Math.floor(container.offsetHeight / 11)
  return {x: numX, y: numY}
} 

export const sizeOptions = () => {
  const startValue = 7
  const maxValues = sizeRecommended()

  const createOptions = (value) => {
    return new Array(1 + value - startValue)
      .fill(0)
      .map((d,i)=>{
        const val = i + startValue
        return `<option ${val === 10 ? "selected" : ""}>${val}</option>`})
  }

  document.querySelector("#select-dimx").innerHTML = createOptions(maxValues.x)
  document.querySelector("#select-dimy").innerHTML = createOptions(maxValues.y)
} 

export const applySquareSize = (dimx, dimy, container, doc = document) => {
  // compute square size
  // const size = maxSquareSize(dimx,dimy,container)
  const size = utils.maxSquareSize(dimx, dimy, container)
  // get last style sheet in list
  const sheet = [...doc.styleSheets].slice(-1)[0]
  // remove rule if already present
  sheet.cssRules[0].selectorText === ".square" && sheet.deleteRule(0)
  // add new rule with computed square size values
  sheet.insertRule(`.square {width:${size}px; height:${size}px}`, 0)
}

export const renderSetupPage = (container, defaults = { x: 10, y: 10, seed: 12345 }) => {

  const div = document.createElement("div")
  div.id = "setup-container"
  div.innerHTML =
    `
  <label for="dimx">Anzahl x:</label>
  <input type="text" id="dimx" name="x" value="${defaults.x}">
  <label for="dimy">Anzahl y:</label>
  <input type="text" id="dimy" name="y" value="${defaults.y}">
  <label for="select-dimx">Anzahl x:</label>
  <select type="text" id="select-dimx" name="select-x"></select>
  <label for="select-dimy">Anzahl y:</label>
  <select type="text" id="select-dimy" name="select-y"></select>
  <label for="seed">Seed:</label>
  <div id="seed-input-area">
  <input type="text" id="seed" name="seed" value="${defaults.seed}"><span id="random-seed">⟳</span>
  </div>
  `

  // start game on click
  const button = document.createElement("button")
  button.id = "start-game-button"
  // button.innerText = "Start Game"
  button.innerHTML = "Start Game"
  button.onclick = () => utils.startGame(container)
  div.appendChild(button)
  container.appendChild(div)
  readInputFromLocal()
  // writeInputToLocal()

  // get random seed on click
  document.getElementById("random-seed").onclick = () => { insertRandSeed() }

  // apply field size selection options
  sizeOptions()
  window.onresize = () => {
    sizeOptions()
  }

}

export const writeInputToLocal = () => {
  document.querySelectorAll("#setup-container input").forEach(input => {
    // input.addEventListener('input', function() {
      localStorage.setItem(input.id, input.value);
    // });
  });
}

export const readInputFromLocal = () => {
  document.querySelectorAll("#setup-container input").forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue) input.value = savedValue;
  });
}

export const insertRandSeed = () => {
  const randValue = Math.floor(Math.random() * 100000)
  document.getElementById("seed").value = randValue
  localStorage.setItem("seed",randValue)
}

export const startGame = (container) => {
  writeInputToLocal()
  showFooterContent()
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
  utils.startTimer()

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

export const startTimer = () => {
  const timerElement = document.getElementById("timer-container")
  const startTime = Date.now();

  const timeFormat = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(2);
    return (
      seconds == 60 ?
        (minutes + 1) + ":00" :
        (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }

  timerID = setInterval(() => {
    // const time = Date.now() - startTime
    const time = utils.timeDifference(startTime)
    timeToSolve = timeFormat(time)
    timerElement.innerText = timeFormat(time) // (time/1000).toFixed(2)
  }, 10)
}

export const resetTimer = () => {
  clearInterval(timerID)
  const timerElement = document.getElementById("timer-container")
  timerElement.innerText = "00:00.00"
}

export const timeDifference = (startTime) => {
  return Date.now() - startTime
}

export const showFooterContent = () => {
  resetButton()
  mazeInfo()
}

export const resetButton = () => {
  const button = document.querySelector(".backwards")
  button.classList.add("visible")
  button.onclick = () => {
    // remove footer elements
    const footerElements = [...document.querySelector("#footer").children]
    footerElements.forEach(d=>d.classList.remove("visible"))
    // remove maze
    const container = document.querySelector("#container")
    container.innerHTML = ""
    // re-create setup page
    renderSetupPage(container)
    resetTimer()
    utils.destroyChart()
  }
}

export const mazeInfo = () => {
  const mazeInfo = document.querySelector(".maze-info")
  mazeInfo.classList.add("visible")
  mazeInfo.innerHTML = `${localStorage.getItem("seed")} (${localStorage.getItem("dimx")}x${localStorage.getItem("dimy")})`
}

export const destroyChart = () => {
  gameChart.destroy()
}