dropdown = document.querySelector(".link-list");
document.querySelector(".toggle").addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
})
addEventListener('resize', () => {
    dropdown.style.display = "none"
})