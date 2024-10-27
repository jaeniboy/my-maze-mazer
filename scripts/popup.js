import {names} from "../data/players"

export function floatToTimeString(floatTime) {
    // round to get two digits after comma
    floatTime = Math.round(floatTime * 100) / 100;
    
    let minutes = Math.floor(floatTime / 60);
    let seconds = Math.floor(floatTime % 60);
    let milliseconds = Math.round((floatTime % 1) * 100);

    // format strings
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    milliseconds = milliseconds.toString().padStart(2, '0');

    // compose time string
    return `${minutes}:${seconds}.${milliseconds}`;
}

export const generatePlayerListHTML = (names, times) => {
    const ul = document.createElement('ul');
    ul.className = 'player-list';
  
    names.forEach((name,index) => {
        const li = document.createElement('li');
        li.className = 'player-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = name;
        // nameSpan.textContent = player.name;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'player-time';
        timeSpan.textContent = floatToTimeString(times[index]);

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        ul.appendChild(li);
    });

    return ul;
}

export const addGrading = (playerTime, othersTimes) => {
    const min = Math.min(...othersTimes)
    const max = Math.max(...othersTimes)
    const grading = playerTime < min ? "pretty good" : playerTime > max ? "far from perfect. Try again" : "good"

    document.querySelector("#grading").innerHTML = grading
}

// main function to show component
export const showPopup = (playerTime,times) => {
    animateCloseButton()
    addGrading(playerTime, times)
    addPlayerData(names, times)
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
const addPlayerData = (names, times) => {
    const playerListContainer = document.querySelector('.player-list-container');
    playerListContainer.innerHTML = "";
    const playerListHTML = generatePlayerListHTML(names, times);
    playerListContainer.appendChild(playerListHTML);
}



