
/*
    JavaScript document used to configure the params of the test
*/

document.getElementById("btnStart").addEventListener('click', () => {

    showTest()

})

function showTest() {
    
    var actualTest = document.querySelector('.test-ground')

    if (actualTest.style.display == "grid") {
        actualTest.style.display = "none";
        
        return;
    }

    actualTest.style.display = "grid";
}