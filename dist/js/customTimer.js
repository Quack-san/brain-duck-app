const errorAlert = document.querySelector(".error-alert");
const inputHour = document.getElementById('hour');
const inputMinute = document.getElementById('minute');

document.getElementById('testTime').addEventListener('click', () => { 
    document.querySelector(".test-time-handler").style.display = "flex"; 
    setVeilDisplay("block");
});

document.getElementById('cancelTime').addEventListener('click', () => { 
    document.querySelector(".test-time-handler").style.display = "none";
    setVeilDisplay("none");
});

document.getElementById('saveTime').addEventListener('click', () => { saveTime(timer) } );

var timer;
var hour;
var minute;

// Code to manually select the timer

document.querySelectorAll(".handler").forEach( (button) => {
    button.addEventListener('click', (event) => { timerChanger(event.target) })
})

function timerChanger(btn) {
    var timerNow = parseInt(inputHour.value) * 60;
    timerNow += parseInt(inputMinute.value);

    var modifier;
    if (btn.classList.contains('hour')) { modifier = 60 } else { modifier = 10 }
    if (btn.classList.contains('increase')) { timerNow += modifier } else { timerNow -= modifier}

    if (timerNow > 720) { timerNow = 720 } else if ( timerNow < 1) { timerNow = 0 }

    timer = timerNow;

    hour = Math.floor(timerNow / 60);
    timerNow = timerNow % 60;
    minute = timerNow;

    inputHour.value = hour < 10 ? "0"+hour : hour;
    inputMinute.value = minute <= 0 ? "00" : minute;
}

// Sanitaze user selected timer
function saveTime(timer) { 
    if (timer <= 0) {
        errorMenssage('O TEMPO SELECIONADO É INVÁLIDO');
        return;
    }
    timeDisplayHandler("none");
    document.querySelector("#timerDiv").setAttribute("setted", "true");
}

function setVeilDisplay(displayValue) { document.querySelector(".dark-veil").style.display = displayValue; }

function errorMenssage(text) {
    errorAlert.style.display = "flex";
    errorAlert.childNodes.item(1).innerText = text;
}
document.querySelector(".alert-ok").addEventListener('click', () => { errorAlert.style.display = "none" } )