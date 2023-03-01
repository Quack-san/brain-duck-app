
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
});

document.getElementById("showCustomTestTime").addEventListener('click', () => {
    var spanHour = document.querySelector("#spanTimeHour");
    var spanMinute = document.querySelector("#spanTimeMinute");

    if (spanHour.style.display == "block") {
        spanHour.style.display = "none";
        spanMinute.style.display = "none";
        return;
    }
    spanHour.style.display = "block";
    spanMinute.style.display = "block";
});