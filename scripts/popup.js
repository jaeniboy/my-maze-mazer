import playersData from "../data/players.json"
// import {chart} from "../scripts/chart"
// import { timeToSolve } from "./utils";

export const generatePlayerListHTML = (players) => {
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
    animateCloseButton()
    addPlayerData(playersData)
    const overlay = document.querySelector('.popup-overlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

// close button with animation
export const animateCloseButton= () => {
    document.querySelector('.close-button').addEventListener('click', () => {
        const overlay = document.querySelector('.popup-overlay');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    });
}

// add player data to html
const addPlayerData = (data) => {
    const playerListContainer = document.querySelector('.player-list-container');
    const playerListHTML = generatePlayerListHTML(data);
    playerListContainer.appendChild(playerListHTML);
}



