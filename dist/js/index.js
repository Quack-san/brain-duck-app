var btnMenu = document.getElementById("fuckboy");
btnMenu.addEventListener('click', displaySideMenu);

var sideMenu = document.getElementById("lista");

function displaySideMenu() {
    console.log('button working')

    if ( sideMenu.style.display == "block") {
        sideMenu.style.display = "none";

        return;
    }

    sideMenu.style.display = "block";
}