// when clicked in the button show or hide the menu
document.getElementById("sideMenuBtn").addEventListener('click', () =>  {
    var sideMenu = document.getElementById("lista");
    if (sideMenu.style.display == "block") {
        sideMenu.style.display = "none";
        return;
    }

    sideMenu.style.display = "block";
});

// when clicked in body and not in the button hide the menu
document.querySelector("body").addEventListener('click', () => {
    var sideMenuBtn = document.querySelector("#sideMenuBtn").querySelector(".img-logo");
    if (event.target == sideMenuBtn) { return; }
    var sideMenu = document.getElementById("lista");
    if (sideMenu.style.display == "block") {
        sideMenu.style.display = "none";
        return;
    }
}, true);