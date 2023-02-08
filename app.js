//****** IMPORT SOUND ******//
const successMusic = new Audio('./assets/sound/success.wav');
const clockSong = new Audio('./assets/sound/clock.wav')

const formLabel = document.querySelector('.form_content label');
const formInput = document.querySelector('#name');
const btnStart = document.querySelector('#btn_start');
const inputInfos = document.querySelector('#input_infos');
let timerRef = document.querySelector('#timerRef');
 
const allCard = document.querySelectorAll('.card');

//****** VARIABLES ******//
let nameChecked = false;
let firstCard, secondCard;
let selectedCard = false;
let cardNumber = 0;
let [minutes, seconds] = [0,0];

let player = {
    name : '',
    time : ''
};

//****** CONNECTION ******//
formInput.addEventListener('input', checkName);
btnStart.addEventListener('click', startGame);

function checkName(e){   
    player.name = e.target.value;

    formLabel.classList.add('anim');
    
    //Entre 3 et 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés
    if(!/^([A-Za-z|\s]{3,15})?([-]{0,1})?([A-Za-z|\s]{3,15})$/.test(player.name)) {
        formInput.classList.add('error');
    } else {
        formInput.classList.remove('error');
        nameChecked = true;
    }
    if(!player.name){
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
    
    localStorage.setItem('player', JSON.stringify(player));
    document.querySelector('.main_start').classList.add('hiddenOverlay');

    displayTime()
    
};

//****** CARDS ******//
allCard.forEach(card => {
    card.addEventListener('click', checkCard);
});

function checkCard(){

    this.classList.toggle('return');

    if(!selectedCard){
        firstCard = this;
        selectedCard = true;
        return
    };

    secondCard = this;
    selectedCard = false;
     
    compareData()
};

function compareData(){

    if(firstCard.getAttribute('data') === secondCard.getAttribute('data')){

        successMusic.play()
        cardNumber += 2;

        firstCard.removeEventListener('click', checkCard)
        secondCard.removeEventListener('click', checkCard)
    } else{
        setTimeout(() => {
            firstCard.classList.remove('return')
            secondCard.classList.remove('return')
        }, 500);
    }   
}
  
//****** TIMER ******//
function displayTime(){

    const timer = setInterval(() => {

        if(seconds == 0){
            seconds = 60
            
        } else if (seconds <= 10){
            seconds = `${0 + seconds}`
        }
        seconds--

        if(seconds <= 8){
            clockSong.play()
            timerRef.style.color = 'crimson'
        }
        
        let m = "0" + minutes;
        let s = seconds < 10 ? "0" + seconds : seconds

        timerRef.innerHTML = `${m} : ${s}`

        GameOver(timer)

    }, 1000);      
};

//****** GAME OVER ******//
function GameOver(timer){
    if(seconds <= 0 || cardNumber === allCard.length){
        clearInterval(timer);
        clockSong.pause()
        setTimeout(() => {
            document.querySelector('.main_end').classList.add('showOverlay');
        }, 200);
    }
}

//****** REFRESH ******//
document.querySelector('#btn_restart').addEventListener('click', () => {
    location.reload();
});

    
    
    
        