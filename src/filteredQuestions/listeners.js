import { setAlternativeSelected, questionCorrected } from './filteredQuestions.js'

function setListeners () {
    // alternatives in html
    document.querySelectorAll(".alternative").forEach((alternative) => {
        alternative.addEventListener('click', (event) => {
            setAlternativeSelected(selectAlternative(event));
        });
    });

    // supplementaryText
    document.querySelector("#supplementaryTextButton").addEventListener("click", (event) => {
        var supplementaryTextDiv = document.querySelector("#supplementaryText");
        if (supplementaryTextDiv.style.display == "block") { supplementaryTextDiv.style.display = "none"; }
        else { supplementaryTextDiv.style.display = "block"; }
    });
    
    // question images
    document.querySelector("#questionImageButton").addEventListener("click", (event) => {
        var questionImage = document.querySelector("#questionImage");
        if (questionImage.style.display == "block") { questionImage.style.display = "none"; }
        else { questionImage.style.display = "block"; }
    });
}

function selectAlternative(event) {
    if (questionCorrected) { return; }
	var selected = event.target;

	if (selected.classList.contains("selected")) {
        changeClasses(selected, "remove", "selected");
		return undefined;
	}
	document.querySelectorAll(".alternative").forEach((alternative) => {
        changeClasses(alternative, "remove", "selected");
	});
    changeClasses(selected, "add", "selected");
	return selected.getAttribute("alternative");
}

function changeClasses(element, operation, classValue) {
	if (operation == "add" && !element.classList.contains(classValue)) { element.classList.add(classValue); }
	if (operation == "remove" && element.classList.contains(classValue)) { element.classList.remove(classValue); }
}


export { setListeners };

