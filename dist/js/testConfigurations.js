
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

// document.getElementById("showCustomTestTime").addEventListener('click', () => {
//     var spanHour = document.querySelector("#spanTimeHour");
//     var spanMinute = document.querySelector("#spanTimeMinute");

//     if (spanHour.style.display == "block") {
//         spanHour.style.display = "none";
//         spanMinute.style.display = "none";
//         return;
//     }
//     spanHour.style.display = "block";
//     spanMinute.style.display = "block";
// });