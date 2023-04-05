function changeTestDisplay() {
    var actualTest = document.querySelector('.test-ground');
    if (actualTest.style.display == "grid") {
        actualTest.style.display = "none";
        return;
    }
    actualTest.style.display = "grid";
    document.querySelector('.test-cover').style.display = 'none';
};

// set question in HTML
function setQuestion(question) {
	//document.getElementById("questionNumber").innerText = question.number + ")";
	document.getElementById("questionContent").innerText = question.content;
}

// set alternative innerText in html
function setAlternativesContent(alternativesArray) {
	const alternativesDOM = document.querySelectorAll(".alternative");
	for (var i = 0; i < alternativesDOM.length; i++) {
		alternativesDOM[i].innerText = alternativesArray[i].data.content;
	}
}

// set alternatives classes according to the current state
function setAlternativesClasses(testIsFinished, questionAnswers, correctAnswer) {
	const alternativesDOM = document.querySelectorAll(".alternative");
	alternativesDOM.forEach((alternative) => {
		// remove classes
		changeClasses(alternative, "remove", "selected");
		if (testIsFinished) {
			changeClasses(alternative, "remove", "correct");
			changeClasses(alternative, "remove", "wrong");
			changeClasses(alternative, "remove", "rightAnswer");
		}
		// add classes
		if (questionAnswers == alternative.getAttribute("alternative")) {
			if (!testIsFinished) { changeClasses(alternative, "add", "selected"); }
            else if (correctAnswer == alternative.getAttribute("alternative")) 
            	{ changeClasses(alternative, "add", "correct"); } 
            else { changeClasses(alternative, "add", "wrong"); }
		} else if (testIsFinished && correctAnswer == alternative.getAttribute("alternative")) {
			changeClasses(alternative, "add", "rightAnswer");
		}
	});
}

// set the classes in the divs status
function setDivStatusCorrection(correctionStatus) {
	var divs = document.querySelectorAll(".questionNumber");
	for (var i = 0; i < divs.length; i++) {
		if (correctionStatus[i].isCorrect) {
			divs[i].classList.add("correct");
		} else {
			divs[i].classList.add("wrong");
		}
	}
}

function changeClasses(element, operation, classValue) {
	if (operation == "add" && !element.classList.contains(classValue)) { element.classList.add(classValue); }
	if (operation == "remove" && element.classList.contains(classValue)) { element.classList.remove(classValue); }
}

// event when user click on an alternative
function selectAlternative(event, testIsFinished, questionNumber) {
	if (testIsFinished) { return; }
	var selected = event.target;
	var divStatus = getDivStatus(questionNumber);

	if (selected.classList.contains("selected")) {
        changeClasses(selected, "remove", "selected");
        changeClasses(divStatus, "remove", "selected");
        changeClasses(divStatus, "add", "notSelected");
		return undefined;
	}
	document.querySelectorAll(".alternative").forEach((alternative) => {
        changeClasses(alternative, "remove", "selected");
	});
    changeClasses(selected, "add", "selected");
    changeClasses(divStatus, "add", "selected");
    changeClasses(divStatus, "remove", "notSelected");
	return selected.getAttribute("alternative");
}

// get div status according to the current question number;
function getDivStatus(questionNumber) {
	var divReturn;
	document.querySelectorAll(".questionNumber").forEach((div) => {
		if (div.innerText == questionNumber) { divReturn = div; }
	});
	return divReturn;
}

function setSupplementaryText(supplementaryTextId, supplementaryTextArray) {
	var supplementaryTextDiv = document.querySelector("#supplementaryText");
	if (supplementaryTextId == "none") {
		supplementaryTextDiv.innerText = "Esta questão não possui texto complementar";
	}
	else {
		for (var i = 0; i < supplementaryTextArray.length; i++) {
			if (supplementaryTextArray[i].id == supplementaryTextId) {
				supplementaryTextDiv.innerText = supplementaryTextArray[i].data.content;
			}
		}
	}
}

// set all the div status
function setDivTestStatus(numberOfQuestions) {
	for (var i = 0; i < numberOfQuestions; i++) {
		var divQuestionNumber = document.createElement("label");
		divQuestionNumber.classList.add("notSelected", "questionNumber");
		divQuestionNumber.setAttribute("role", "button");
		var divTextContent = document.createTextNode(i + 1);
		divQuestionNumber.appendChild(divTextContent);
		document.getElementById("divQuestionNumber").appendChild(divQuestionNumber);
	}
}

export { setQuestion, setAlternativesContent, setAlternativesClasses, setDivTestStatus, getDivStatus, setDivStatusCorrection,
	changeClasses, selectAlternative, setSupplementaryText, changeTestDisplay };