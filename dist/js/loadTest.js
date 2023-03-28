document.getElementById('sLoad').addEventListener('click', () => {
    if (document.getElementById('load').style.display == 'none') {
        document.getElementById('load').style.display='flex';
    } else { document.getElementById('load').style.display='none'; }

    if (document.querySelector(".dark-veil").style.display == 'none') {
        document.querySelector(".dark-veil").style.display = 'block';
    } else { document.querySelector(".dark-veil").style.display = 'none'; }
})