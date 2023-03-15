
/*
    JavaScript document used to configure the params of the test
*/

document.getElementById("btnStartTest").addEventListener('click', () => {
    var actualTest = document.querySelector('.test-ground')
    if (actualTest.style.display == "grid") {
        actualTest.style.display = "none";
        return;
    }
    actualTest.style.display = "grid";

    document.querySelector('.test-cover').style.display = 'none';
});

document.getElementById('testTime').addEventListener('click', () => { timeDisplayHandler('show') })
document.getElementById('cancelTime').addEventListener('click', () => { timeDisplayHandler('none') })

function timeDisplayHandler(display) {
    var timeBoxHadler = document.querySelector(".test-time-handler");
    var veil = document.querySelector(".dark-veil");

    switch (display) {
        case 'show':
            timeBoxHadler.style.display = "flex";
            veil.style.display = "block";
            break;
        case 'none':
            timeBoxHadler.style.display = "none";
            veil.style.display = "none";
            break;
    }
}

// Code to manually select the timer

document.querySelectorAll(".handler").forEach( (button) => {
    button.addEventListener('click', (evt) => { timerChanger(evt.target) })
})

function timerChanger(btn) {
    var inputHour = document.getElementById('hour');
    var inputMinute = document.getElementById('minute');

    var timerNow = parseInt(inputHour.value) * 60;
    timerNow += parseInt(inputMinute.value);

    var modifier;
    if (btn.classList.contains('hour')) { modifier = 60 } else { modifier = 10 }
    if (btn.classList.contains('increase')) { timerNow += modifier } else { timerNow -= modifier}

    if (timerNow > 720) { timerNow = 720 } else if ( timerNow < 0) { timerNow = 0 }

    var hour = Math.floor(timerNow / 60);
    timerNow = timerNow % 60;
    var minute = timerNow;

    inputHour.value = hour < 10 ? "0"+hour : hour;
    inputMinute.value = minute <= 0 ? "00" : minute;
}