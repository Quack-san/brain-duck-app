dropdown = document.querySelector(".dropdown");
document.querySelector(".toggle").addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display == "none" ? "grid" : "none";
})
addEventListener('resize', () => {
    dropdown.style.display = "none"
})