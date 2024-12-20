import Maze from "../scripts/script"
import * as utils from "../scripts/utils"
import { gameChart } from "./chart"
import { download } from "./exports"

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
  const maxValues = utils.sizeRecommended()

  const createOptions = (value) => {
    return new Array(1 + value - startValue)
      .fill(0)
      .map((d,i)=>{
        const val = i + startValue
        return `<option>${val}</option>`})
  }

  const dimx = document.querySelector("#select-dimx")
  dimx.innerHTML = createOptions(maxValues.x)
  const dimxLocal = localStorage.getItem("select-dimx") 
  dimx.value = dimxLocal ? dimxLocal : 10

  const dimy = document.querySelector("#select-dimy")
  dimy.innerHTML = createOptions(maxValues.y)
  const dimyLocal = localStorage.getItem("select-dimy") 
  dimy.value = dimyLocal ? dimyLocal : 10
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
  <label>Size: <i class="bi bi-question-circle" id="size-info"></i></label>
  <div id="size-selections">
    <div>
      <i class="bi bi-arrows"></i><select type="text" id="select-dimx" name="select-x"></select>
    </div>
    <div>
      <i class="bi bi-arrows-vertical"></i><select type="text" id="select-dimy" name="select-y"></select></div>
    </div>
  <label for="seed">Seed: <i class="bi bi-question-circle" id="seed-info"></i></label>
  <div id="seed-input-area">
  <input type="text" id="seed" name="seed" value="${defaults.seed}"><span id="random-seed"><i class="bi bi-arrow-clockwise"></i></span>
  </div>
  `

  // start game on click
  const button = document.createElement("button")
  button.id = "start-game-button"
  button.innerHTML = "Start Game"
  button.onclick = () => utils.startGame(container)
  div.appendChild(button)
  container.appendChild(div)
  readInputFromLocal()

  // get random seed on click
  document.getElementById("random-seed").onclick = () => { insertRandSeed() }

  // show info on click
  document.querySelector("#size-info").onclick = () => { sizeInfo()}
  document.querySelector("#seed-info").onclick = () => { seedInfo()}

  // apply field size selection options
  utils.sizeOptions()
  window.onresize = () => {
    utils.sizeOptions()
  }

}

export const writeInputToLocal = () => {
  // document.querySelectorAll("#setup-container input").forEach(input => {
  document.querySelectorAll("#setup-container select").forEach(input => {
    // input.addEventListener('input', function() {
      localStorage.setItem(input.id, input.value);
    // });
  });
}

export const readInputFromLocal = () => {
  document.querySelectorAll("#setup-container select").forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue) input.value = savedValue;
  });

  const seedValue = localStorage.getItem("seed");
  if (seedValue) document.querySelector("#seed").value = seedValue;
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
  const dimx = Number(document.getElementById("select-dimx").value)
  const dimy = Number(document.getElementById("select-dimy").value)
  const seed = document.getElementById("seed").value
  const maze = new Maze(dimx, dimy, container, seed)
  maze.createFinalGrid()
  maze.addToContainer()
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
  const timerElement = document.querySelector("#timer-container")
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
    // timerElement.innerText = timeFormat(time) // (time/1000).toFixed(2)
    timerElement.innerHTML = timeFormat(time) // (time/1000).toFixed(2)
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
  downloadOptions()
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
  const seedLocal = localStorage.getItem("seed")
  const seedInput = document.querySelector("#seed").value
  mazeInfo.innerHTML = `${seedLocal ? seedLocal : seedInput} (${localStorage.getItem("select-dimx")}x${localStorage.getItem("select-dimy")})`
}

export const downloadOptions = () => {
  const downloadIcon = document.querySelector(".download")
  downloadIcon.classList.add("visible")
  downloadIcon.onclick = () => {
    utils.addDownloadPopup()
  }

  const container = document.querySelector("#container")
  document.getElementById("download-svg").onclick = (event)=> {
    event.stopPropagation();
    utils.removeDownloadPopup()
    download(container, "svg")
  }
  document.querySelector("#download-png").onclick = (event)=> {
    event.stopPropagation();
    utils.removeDownloadPopup()
    download(container, "png")
  }
  document.querySelector("#download-popup-overlay").onclick = ()=>{
    utils.removeDownloadPopup()
  }
}

export const addDownloadPopup = () => {
  const downloadPopupOverlay = document.querySelector("#download-popup-overlay")
  const downloadPopup = document.querySelector("#download-popup")

  downloadPopupOverlay.classList.add("block")
  downloadPopup.classList.add("flex")
}

export const removeDownloadPopup = () => {
  document.querySelector("#download-popup-overlay").classList.remove("block")
  document.querySelector("#download-popup").classList.remove("flex")
}

export const destroyChart = () => {
  gameChart.destroy()
}

export const sizeInfo = () => {
  window.alert("Choose the number of blocks vertically and horizontally. Available options depend on your screen size to prevent blocks becoming too small to use.")
}

export const seedInfo = () => {
  window.alert("Mazes that share the same dimensions and seed values are generated in the same manner each time. You can choose any string as a seed, from common words to random combinations of numbers and characters.")
}