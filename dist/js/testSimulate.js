// firebase configs / imports
import { initializeApp } from 'firebase/app'
import {
	getFirestore, collection, getDocs, doc, onSnapshot, query, where, getDoc
} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: "AIzaSyAc9-XbuWPI7dayYtDE0OlVXuDbDChZqjE",
	authDomain: "testefirebase-45098.firebaseapp.com",
	databaseURL: "https://testefirebase-45098-default-rtdb.firebaseio.com",
	projectId: "testefirebase-45098",
	storageBucket: "testefirebase-45098.appspot.com",
	messagingSenderId: "583024602798",
	appId: "1:583024602798:web:64a2571fb450852e2d873f",
	measurementId: "G-5CSTKPFGR6"
};

initializeApp(firebaseConfig);

// data base
const db = getFirestore();

//global variables
const testId = new URLSearchParams(window.location.search).get('testId');
var questionNumber = 1;
var numberOfQuestions;
var isFinished = false;
var questionsObjArray = [];
var alternativesObjArray = [];
var questionAnswers;
var correctionStatus;
var supplementaryTextArray = [];
var testTime;
var pointerTime;

function setUndefinedArray(elementsNumber) {
	var undefinedArray = [];
	for (var i = 0; i < elementsNumber; i++) { undefinedArray[i] = undefined; }
	return undefinedArray;
}

getTest();

document.querySelector("#btnStartTest").addEventListener('click', async () => {
	programStatus("Starting test.")
	questionsObjArray = sortQuestions(await getFilteredDocsArray("testId", testId, collection(db, 'questions')));
	numberOfQuestions = questionsObjArray.length;
	questionAnswers = setUndefinedArray(numberOfQuestions);
	correctionStatus = setUndefinedArray(numberOfQuestions);
	for (var i = 0; i < numberOfQuestions; i++) {
		alternativesObjArray[i] = await getFilteredDocsArray("questionId", questionsObjArray[i].id, collection(db, 'alternatives'));
	}
	for (var i = 0; i < questionsObjArray.length; i++) {
		if (supplementaryTextArray.includes(questionsObjArray[i].data.supplementaryTextId)) { continue; }
		if (questionsObjArray[i].data.supplementaryTextId == "none") { continue; }
		supplementaryTextArray.push(await getSingleDocumentById("supplementaryTexts", questionsObjArray[i].data.supplementaryTextId));
	}
	setQuestion();
	setsupplementaryText();
	setAlternativesContent();
	setDivTestStatus(numberOfQuestions);
	getDivStatus().classList.add("activeQuestion");

	pointerTime = new Date().getSeconds();
	var testTimeInterval = setInterval(setTestTime, 1000);
	if (document.querySelector("#timerDiv").getAttribute("setted") == "true") {
		testTime = parseInt(document.querySelector("#hour").value) * 60 * 60 +
			parseInt(document.querySelector("#minute").value) * 60;
	}
});

async function getFilteredDocsArray(attribute, value, collection) {
    var q = query(collection, where(attribute, "==", value));
    var docsArray = await getDocs(q)
        .then((snapshot) => {
            var returnDocsArray = [];
            snapshot.docs.forEach((doc) => { returnDocsArray.push({"data": doc.data(), "id": doc.id}); });
            return returnDocsArray;
        }).catch((err) => {
            console.log("Error in getDocs: " + err);
        })
    return docsArray;
}

async function getSingleDocumentById(collectionName, docId) {
	const returnDoc = await getDoc(doc(db, collectionName, docId));
	if (returnDoc.exists()) { return {"data": returnDoc.data(), "id": returnDoc.id}; }
}

function sortQuestions(questions) {
	 var arrayCopy = [];
	 for (var i = 0; i < questions.length; i++) { arrayCopy[i] = questions[i] }

	 for (var i = 0; i < questions.length; i++) {
		for (var j = i; j < questions.length; j++) {
			if (questions[j].data.number < questions[i].data.number) {
				 arrayCopy[j] = questions[i]; 
				 arrayCopy[i] = questions[j];
			}
		}
		return arrayCopy;
	 }
}

// set question in HTML
function setQuestion() {
	document.getElementById("questionNumber").innerText = questionsObjArray[questionNumber - 1].data.number + ")";
	document.getElementById("questionContent").innerText = questionsObjArray[questionNumber - 1].data.content;
	programStatus("Question setted.");
}

// add eventListener to alternatives in HTML
document.querySelectorAll(".alternative").forEach((alternative) => {
	alternative.addEventListener('click', selectAlternative);
});

// set alternative innerText in html
function setAlternativesContent() {
	const alternativesDOM = document.querySelectorAll(".alternative");
	for (var i = 0; i < alternativesDOM.length; i++) {
		alternativesDOM[i].innerText = alternativesObjArray[questionNumber - 1][i].data.content;
	}
	programStatus("Alternatives content setted.");
}

// set alternatives classes according to the current state
function setAlternativesClasses() {
	const alternativesDOM = document.querySelectorAll(".alternative");
	alternativesDOM.forEach((alternative) => {
		// remove classes
		changeClasses(alternative, "remove", "selected");
		if (isFinished) {
			changeClasses(alternative, "remove", "correct");
			changeClasses(alternative, "remove", "wrong");
			changeClasses(alternative, "remove", "rightAnswer");
		}
		// add classes
		if (questionAnswers[questionNumber - 1] == alternative.getAttribute("indexAlternative")) {
			if (!isFinished) {
				changeClasses(alternative, "add", "selected");
			} else if (correctionStatus[questionNumber - 1].isCorrect) {
				changeClasses(alternative, "add", "correct");
			} else {
				changeClasses(alternative, "add", "wrong");
			}
		} else if (isFinished && correctionStatus[questionNumber - 1].correctAnswer ==
			parseInt(alternative.getAttribute("indexAlternative"))) {
			changeClasses(alternative, "add", "rightAnswer");
		}
	});
	programStatus("Alternatives classes setted.");
}
function changeClasses(element, operation, classValue) {
	if (operation == "add") { element.classList.add(classValue); }
	if (operation == "remove" && element.classList.contains(classValue)) {
		element.classList.remove(classValue)
	}
}

// event when user click on an alternative
function selectAlternative(event) {
	if (isFinished) { return; }
	var selected = event.target;
	var divStatus = getDivStatus();

	if (selected.classList.contains("selected")) {
		selected.classList.remove("selected");
		divStatus.classList.remove("selected");
		divStatus.classList.add("notSelected");
		questionAnswers[questionNumber - 1] = undefined;
		programStatus("Alternative unselected");
		return;
	}
	var alternativesDOM = document.querySelectorAll(".alternative");
	alternativesDOM.forEach((alternative) => {
		if (alternative.classList.contains("selected")) {
			alternative.classList.remove("selected");
		}
	});
	selected.classList.add("selected");
	divStatus.classList.add("selected");
	divStatus.classList.remove("notSelected");
	questionAnswers[questionNumber - 1] = parseInt(selected.getAttribute("indexAlternative"));

	programStatus("Alternative selected");
}

// get div status according to the current question number;
function getDivStatus() {
	var divReturn;
	document.querySelectorAll(".divQuestionStatus").forEach((div) => {
		if (div.innerText == questionNumber) { divReturn = div; }
	});
	return divReturn
}

// set all the div status
function setDivTestStatus(numberOfQuestions) {
	const divTestStatus = document.getElementById("divTestStatus");

	for (var i = 0; i < numberOfQuestions; i++) {
		var divQuestionStatus = document.createElement("button");
		divQuestionStatus.classList.add("notSelected", "divQuestionStatus");
		var divTextContent = document.createTextNode(i + 1);
		divQuestionStatus.appendChild(divTextContent);

		divQuestionStatus.addEventListener('click', (event) => {
			questionNumber = parseInt(event.target.innerText);
			setQuestion();
			setsupplementaryText();
			programStatus("Changing question.")
		});
		divTestStatus.appendChild(divQuestionStatus);
	}
	programStatus("divtestStatus setted.")
}

// listener to the button to go to next question
document.getElementById("nextQuestion").addEventListener('click', (event) => {
	if (questionNumber >= numberOfQuestions) { return; }
	programStatus("Changing to the next question.");
	getDivStatus().classList.remove("activeQuestion");
	questionNumber++;
	getDivStatus().classList.add("activeQuestion");
	setQuestion();
	setsupplementaryText();
	setAlternativesClasses();
	setAlternativesContent();
})
// listener to the button to go to previous question
document.getElementById("previousQuestion").addEventListener('click', (event) => {
	if (questionNumber <= 0) { return; }
	programStatus("Changing to the previous question.");
	getDivStatus().classList.remove("activeQuestion");
	questionNumber--;
	getDivStatus().classList.add("activeQuestion");
	setQuestion();
	setsupplementaryText();
	setAlternativesClasses();
	setAlternativesContent();
})
// listener to links to check if user wants to end the test
document.querySelectorAll("a").forEach((link) => {
	link.addEventListener('click', (event) => {
		if (!confirm("Essa ação terminará com a execução do simulado!") && !isFinished) {
			event.preventDefault();
		}
	});
});

// listener to endTest button. Make the test correction
document.getElementById("endTest").addEventListener('click', correctTest);

function correctTest() {
	isFinished = true;
	var index = 0;
	alternativesObjArray.forEach((alternativeArray) => {
		if (questionAnswers[index] != undefined) {
			if (alternativeArray[questionAnswers[index]].data.isCorrect) {
				correctionStatus[index] = { "isCorrect": true, "correctAnswer": getCorrectAlternative(index) };
			}
			else {
				correctionStatus[index] = { "isCorrect": false, "correctAnswer": getCorrectAlternative(index) };
			}
		}
		else {
			correctionStatus[index] = { "isCorrect": false, "correctAnswer": getCorrectAlternative(index) };
		}
		index++;
	})
	setAlternativesClasses();
	printCorrection();
	setDivStatusCorrection();
	clearInterval(testTimeInterval);
}

function getCorrectAlternative(questionNumber) {
	for (var i = 0; i < alternativesObjArray[questionNumber].length; i++) {
		if (alternativesObjArray[questionNumber][i].data.isCorrect) {
			return i;
		}
	}
}

// print the correction on log
function printCorrection() {
	programStatus("Correction")
	for (var i = 0; i < numberOfQuestions; i++) {
		programStatus("question " + (i + 1) + ": " + correctionStatus[i].isCorrect);
	}
}

// set the classes in the divs status
function setDivStatusCorrection() {
	var divs = document.querySelectorAll(".divQuestionStatus");
	for (var i = 0; i < divs.length; i++) {
		if (correctionStatus[i].isCorrect) {
			divs[i].classList.add("correct");
		} else {
			divs[i].classList.add("wrong");
		}
	}
}

// institution and test infos and time
function getTest() {
	var testReference = doc(db, 'tests', testId);
	getDoc(testReference)
		.then((doc) => {
			document.querySelector("#test-year").innerText = doc.data().year;
			getInstitution(doc.data().institutionId);
		});
}
function getInstitution(institutionId) {
	var institutionReference = doc(db, 'institutions', institutionId);
	getDoc(institutionReference)
		.then((doc) => {
			testTime = 60 * doc.data().time;
			document.querySelector("#testTime").innerText = formateTime(testTime);
			document.querySelector("#test-name").innerText = doc.data().name;
		});
}

function setTestTime() {
	if (isFinished) { return }
	var nowTime = new Date().getSeconds();
	var diferenceInTime;
	if (nowTime > pointerTime) { diferenceInTime = nowTime - pointerTime }
	else {
		diferenceInTime = (60 - pointerTime) + nowTime;
	}
	pointerTime = nowTime;
	testTime -= diferenceInTime;

	if (testTime <= 0) {
		programStatus("Time's Up!");
		testTime = 0;
		alert("Time's Up!");
		correctTest();
	}
	document.querySelector("#countDown").innerText = formateTime(testTime);
}

function formateTime(testTime) {
	var timeFormate = testTime;
	var hours = Math.floor(timeFormate / (60 * 60));
	timeFormate -= hours * (60 * 60);
	var minutes = Math.floor(timeFormate / 60);
	timeFormate -= minutes * 60;
	var seconds = timeFormate;

	return hours + "h " + minutes + "m " + seconds + "s";
}
//////////////// supplementaryText
document.querySelector("#supplementaryTextButton").addEventListener("click", (event) => {
	var supplementaryTextDiv = document.querySelector("#supplementaryText");
	if (supplementaryTextDiv.style.display == "block") { supplementaryTextDiv.style.display = "none"; }
	else { supplementaryTextDiv.style.display = "block"; }
})

function setsupplementaryText() {
	var supplementaryTextDiv = document.querySelector("#supplementaryText");
	if (questionsObjArray[questionNumber - 1].data.supplementaryTextId == "none") {
		supplementaryTextDiv.innerText = "Esta questão não possui texto complementar";
	}
	else { 
		for (var i = 0; i < supplementaryTextArray.length; i++) {
			if (supplementaryTextArray[i].id == questionsObjArray[questionNumber - 1].data.supplementaryTextId) {
				supplementaryTextDiv.innerText = supplementaryTextArray[i].data.content;
			}
		}
	}
}


// general function. print program status
function programStatus(message) { console.log(message); }