//****** IMPORT SOUND ******//
const successMusic = new Audio('./assets/sound/success.wav');
const clockSong = new Audio('./assets/sound/clock.wav');

const formLabel = document.querySelector('.form_content label');
const formInput = document.querySelector('#name');
const btnStart = document.querySelector('#btn_start');
const inputInfos = document.querySelector('#input_infos');
const highscore = document. querySelector('#highscore');
let timerRef = document.querySelector('#timerRef');
 
const allCard = document.querySelectorAll('.main_container_card');

//****** VARIABLES ******//
let nameChecked = false;
let firstCard, secondCard;
let selectedCard = false;
let cardNumber = 0;
let [minutes, seconds] = [0,0];
let lockCard = false;

let currentPlayer = {
    name : '',
    time : ''
};

//****** CONNECTION ******//
formInput.addEventListener('input', checkName);
btnStart.addEventListener('click', startGame);

function checkName(e){   
    currentPlayer.name = e.target.value;

    formLabel.classList.add('anim');
    
    if(!/^([A-Za-z|\s]{3,15})?([-]{0,1})?([A-Za-z|\s]{3,15})$/.test(currentPlayer.name)) {
        formInput.classList.add('error');
    } else {
        formInput.classList.remove('error');
        nameChecked = true;
    }
    if(!currentPlayer.name){
        formInput.classList.remove('error');
        formLabel.classList.remove('anim');
        nameChecked = false;
    }  

    nameChecked ? inputInfos.innerHTML = '' : inputInfos.innerHTML = 'Entre 3 et 15 caractères. Chiffres et caractères spéciaux différents de - non autorisés';

};
  
function startGame(e){

    e.preventDefault();

    if(!nameChecked){
        formInput.classList.add('error');
        setTimeout(() => {
            formInput.classList.remove('error');
        }, 1000);
        return
    } 
    
    document.querySelector('.main_start').classList.add('hiddenOverlay');

    displayTime();
    
};

//****** CARDS ******//
allCard.forEach(card => {
    card.addEventListener('click', selectCard);
});

function selectCard(){

    if(lockCard) return;
    
    this.childNodes[1].classList.toggle('return');

    if(!selectedCard){
        firstCard = this;
        this.removeEventListener('click', selectCard);
        selectedCard = true;
        return
    };

    secondCard = this;
    selectedCard = false;

    compareData();
};

function compareData(){

    lockCard = true;

    if(firstCard.getAttribute('data') === secondCard.getAttribute('data')){

        successMusic.play();
        cardNumber += 2;

        firstCard.removeEventListener('click', selectCard);
        secondCard.removeEventListener('click', selectCard);

        lockCard = false;

    } else{
        
        setTimeout(() => {

            firstCard.addEventListener('click', selectCard);
            firstCard.childNodes[1].classList.remove('return');
            secondCard.childNodes[1].classList.remove('return');

            lockCard = false;
            
        }, 500);

    }   
}
  
//****** TIMER ******//
function displayTime(){

    const timer = setInterval(() => {

        if(seconds == 0){
            seconds = 60;
        } 
        seconds--;

        if(seconds <= 8){
            clockSong.play();
            timerRef.style.color = 'crimson';
        };
        
        let m = "0" + minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        timerRef.innerHTML = `${m} : ${s}`;

        GameOver(timer);

    }, 1000);      
};

//****** GAME OVER ******//
function GameOver(timer){
    if(seconds <= 0 || cardNumber === allCard.length){

        currentPlayer.time = timerRef.innerHTML;

        storageManagement();

        clearInterval(timer);

        clockSong.pause();

        setTimeout(() => {
            document.querySelector('.main_end').classList.add('showOverlay');
        }, 200);
};

//****** MANAGEMENT STORAGE ******//
function storageManagement(){
    let storage = JSON.parse(localStorage.getItem('player'));

    if(!storage){
        storage = [];
        storage.push(currentPlayer);
        localStorage.setItem('player', JSON.stringify(storage));
    } else  {
        
        let playerFind = storage.find(player => player.name === currentPlayer.name);

        if(!playerFind){
            storage.push(currentPlayer);
            localStorage.setItem('player', JSON.stringify(storage));
        } else {
            let currentTime = Number(currentPlayer.time.slice(4,7));
            let registeredTime = Number(playerFind.time.slice(4,7));

            if(registeredTime < currentTime){
                playerFind.time = currentPlayer.time;
                localStorage.setItem('player', JSON.stringify(storage));
            }
        }           
    }}
};

//****** DISPLAY AND SORT HIGHSCORE ******//
let storage = JSON.parse(localStorage.getItem('player'));

if(storage){
    storage.sort((playerA, playerB) => {       
        let playerATime = Number(playerA.time.slice(4,7));
        let playerBTime = Number(playerB.time.slice(4,7));
        
        if(playerATime < playerBTime){
            return -1;
        } else if (playerATime > playerBTime){
            return 1;
        } else {
            return 0;
        }
    });
    storage.forEach(player => {
        highscore.innerHTML = ` ${player.name} <i style='color: gold' class="fa-solid fa-trophy"></i> ${player.time}`;
    });
}

//****** REFRESH ******//
document.querySelector('#btn_restart').addEventListener('click', () => {
    location.reload();
});

//****** RANDOM CARD ******//
function randomCard(){
    allCard.forEach(card => {
        let random = Math.floor(Math.random() * allCard.length);
        card.style.order = random;     
    });
};

randomCard();
