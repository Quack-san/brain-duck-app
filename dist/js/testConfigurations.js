
/*
    JavaScript document used to configure the params of the test
*/

var errorAlert = document.querySelector(".error-alert");
var inputHour = document.getElementById('hour');
var inputMinute = document.getElementById('minute');

document.getElementById('testTime').addEventListener('click', () => { timeDisplayHandler('show') })
document.getElementById('cancelTime').addEventListener('click', () => { timeDisplayHandler('none') })
document.getElementById('saveTime').addEventListener('click', () => { saveTime(timer) } )

var timer;
var hour;
var minute;

document.getElementById("btnStartTest").addEventListener('click', () => {
    var actualTest = document.querySelector('.test-ground')
    if (actualTest.style.display == "grid") {
        actualTest.style.display = "none";
        return;
    }
    actualTest.style.display = "grid";

    document.querySelector('.test-cover').style.display = 'none';
});


function timeDisplayHandler(display) {
    var timeBoxHadler = document.querySelector(".test-time-handler");

    if (display == "show") { timeBoxHadler.style.display = "flex"; veilReveal("block") }
    else { timeBoxHadler.style.display = "none"; veilReveal("none") }

}

// Code to manually select the timer

document.querySelectorAll(".handler").forEach( (button) => {
    button.addEventListener('click', (evt) => { timerChanger(evt.target) })
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

function saveTime(timer) { timer <= 0 ? errorMenssage('O TEMPO SELECIONADO É INVÁLIDO') : timeDisplayHandler("none"); console.log(timer); }

function veilReveal(visibility) { document.querySelector(".dark-veil").style.display = visibility }

function errorMenssage(text) {
    errorAlert.style.display = "flex";
    errorAlert.childNodes.item(1).innerText = text;
}
document.querySelector(".alert-ok").addEventListener('click', () => { errorAlert.style.display = "none" } )