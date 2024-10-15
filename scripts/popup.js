import playersData from "../data/players.json"
import {chart} from "../scripts/chart"
// import { timeToSolve } from "./utils";

const generatePlayerListHTML = (players) => {
    const ul = document.createElement('ul');
    ul.className = 'player-list';
  
    players.forEach(player => {
        const li = document.createElement('li');
        li.className = 'player-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.name;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'player-time';
        timeSpan.textContent = player.time;

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        ul.appendChild(li);
    });

    return ul;
}

// main function to show component
export const showPopup = () => {
    const overlay = document.querySelector('.popup-overlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

//showPopup()

// close button with animation
document.querySelector('.close-button').addEventListener('click', () => {
    const overlay = document.querySelector('.popup-overlay');
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
});

// generate chart data

const getSecondsFromTimeString = (timestring) => {
    const [minutes, seconds] = timestring.split(':');
    const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
    return totalSeconds
}

const getDistributionFromData = (data, maxSeconds = 15) => {
    const result = new Array(maxSeconds).fill(0);
    data.forEach(item => {
    //   const [minutes, seconds] = item.time.split(':');
      const totalSeconds = getSecondsFromTimeString(item.time)//parseInt(minutes) * 60 + parseFloat(seconds);
      const index = Math.floor(totalSeconds);
      if (index < maxSeconds) {
        result[index]++;
      }
    });
    return result;
  }  

const playersDist = getDistributionFromData(playersData)
const playerTime = getSecondsFromTimeString("00:07.12")
console.log(playerTime)
// add chart to window

chart(playerTime,playersDist)

// add player data to html
const playerListContainer = document.querySelector('.player-list-container');
const playerListHTML = generatePlayerListHTML(playersData);
playerListContainer.appendChild(playerListHTML);

console.log("popup works")




