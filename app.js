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
    
    //Entre 3 et 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés
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
    card.addEventListener('click', checkCard);
});

function checkCard(){
    
    this.childNodes[1].classList.toggle('return');

    if(!selectedCard){
        firstCard = this;
        selectedCard = true;
        return
    };

    secondCard = this;
    selectedCard = false;
     
    compareData();
};

function compareData(){

    if(firstCard.getAttribute('data') === secondCard.getAttribute('data')){

        successMusic.play();
        cardNumber += 2;

        firstCard.removeEventListener('click', checkCard);
        secondCard.removeEventListener('click', checkCard);

    } else{

        setTimeout(() => {
            firstCard.childNodes[1].classList.remove('return');
            secondCard.childNodes[1].classList.remove('return');
        }, 500);

    }   
}
  
//****** TIMER ******//
function displayTime(){

    const timer = setInterval(() => {

        if(seconds == 0){
            seconds = 60;
            
        } else if (seconds <= 10){
            seconds = `${0 + seconds}`
        }
        seconds--;

        if(seconds <= 8){
            clockSong.play();
            timerRef.style.color = 'crimson';
        }
        
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

        manageStorage();

        clearInterval(timer);

        clockSong.pause();

        setTimeout(() => {
            document.querySelector('.main_end').classList.add('showOverlay');
        }, 200);
};

//****** MANAGEMENT STORAGE ******//
function manageStorage(){
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

//****** DISPLAY HIGHSCORE ******//
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
        highscore.innerHTML = ` ${player.name}🏆${player.time}`;
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
    
    
        