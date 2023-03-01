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
const testId = getTestId();
var questionNumber = 1;
var numberOfQuestions = 2;
var isFinished = false;
var questionAnswers = [];
var correctionStatus = [];
var testTime;
var pointerTime;
var customTimerSetted = false;
for (var i = 0; i < numberOfQuestions; i++) {
	questionAnswers[i] = undefined;
	correctionStatus[i] = undefined;
}

document.querySelector("#showCustomTestTime").addEventListener('click', () => {
	customTimerSetted = true;
	var timeFormate = testTime;
	var hour = document.querySelector("#customTestTimeHour");
	var hours = Math.floor(timeFormate/(60*60));
	hour.value = hours;
	timeFormate -= hours*(60*60);

	var minute = document.querySelector("#customTestTimeMinute");
	document.querySelector("#spanTimeMinute").style.display = "block";
	minute.value = Math.floor(timeFormate/60);
})

document.querySelectorAll(".customTestTime").forEach((input) => {
	input.addEventListener('click', setCustomTime);
});
function setCustomTime(event) {
	// hours formating
	var input = event.target;

	if (input.getAttribute("id") == "customTestTimeHour" && input.value <= 0 ) {
		var minutes = parseInt(document.querySelector("#customTestTimeMinute").value);
		if (minutes <= 0) {
			document.querySelector("#customTestTimeMinute").value = 50;
			input = 0;
		}
		return;
	}

	// minutes formating
	var hoursEl = document.querySelector("#customTestTimeHour");
	var hours = parseInt(hoursEl.value);
	var minutes = parseInt(event.target.value);

	if (minutes <= 0) {
		if (hours > 0) {
			event.target.value = 50;
			hoursEl.value = hours-1;
		} else {
			event.target.value = 10;
		}
	}
	if (minutes >= 60) {
		event.target.value = 0;
		hoursEl.value ++;
	}
	if (minutes == 0 && hours == 0) {
		event.target.value = 10;
	}

}
function getTestId() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('testId');
}
getTest();


document.querySelector("#btnStartTest").addEventListener('click', () => {
	programStatus("Starting test.")
	getQuestion(questionNumber.toString());
	setDivTestStatus(numberOfQuestions);
	pointerTime = new Date().getSeconds();
	var setIntervalId = setInterval(setTestTime, 1000);
	if (customTimerSetted) { 
		console.log()
		testTime = parseInt(document.querySelector("#customTestTimeHour").value)*60*60 + 
			parseInt(document.querySelector("#customTestTimeMinute").value)*60;
		console.log(testTime);
	}
});


// get question from db
function getQuestion(number) {
	var questionsCollectionReference = collection(db, 'questions');
	var q = query(questionsCollectionReference, where("testId", "==", testId), 
		where("number", "==", number));

	getDocs(q)
	.then((snapshot) => {
		snapshot.docs.forEach((question) => {
			programStatus("Question got.")
			setQuestion(question);
			getAlternatives(question.id);
		})
	})
	.catch((err) => {
		programStatus("Error in getQuestion: " + err);
	})
}

// set question in HTML
function setQuestion(question) {
	document.getElementById("questionNumber").innerText = question.data().number;
	document.getElementById("questionContent").innerText = question.data().text;
	programStatus("Question setted.");
}

// get alternatives from db
function getAlternatives(questionId) {
	var alternativesCollectionReference = collection(db, 'alternatives');
	var q = query(alternativesCollectionReference, where("questionId", "==", questionId));

	var alternatives = [];
	getDocs(q)
	.then((snapshot) => {
		snapshot.docs.forEach((alternative) => {
			alternatives.push({
				"id": alternative.id, 
				"content": alternative.data().content
			});
		});
		setAlternativesContent(alternatives);
		setAlternativesClasses();
		programStatus("Alternatives got.")
	})
	.catch((err) => {
		programStatus("Error in getAlternatives: " + err);
	});
}

// add eventListener to alternatives in HTML
document.querySelectorAll(".alternative").forEach((alternative) => {
	alternative.addEventListener('click', selectAlternative);
});

// set alternative innerText in html
function setAlternativesContent(alternatives) {
	const alternativesDOM = document.querySelectorAll(".alternative");
	for (var i = 0; i < alternativesDOM.length; i++) {
		alternativesDOM[i].innerText = alternatives[i].content;
	}
	programStatus("Alternatives content setted.");
}

// set alternatives classes according to the current state
function setAlternativesClasses() {
	const alternativesDOM = document.querySelectorAll(".alternative");
	alternativesDOM.forEach((alternative) => {
		// remove classes
		if (alternative.classList.contains("selected")) {
			alternative.classList.remove("selected");
		}
		if (isFinished) {
			if (alternative.classList.contains("correct")) {
				alternative.classList.remove("correct");
			}
			if (isFinished && alternative.classList.contains("wrong")) {
				alternative.classList.remove("wrong");
			}
			if (isFinished && alternative.classList.contains("rightAnswer")) {
				alternative.classList.remove("rightAnswer");
			}
		}

		// add classes
		if (questionAnswers[questionNumber-1] == alternative.getAttribute("alternative")) {
			if (!isFinished) {
				alternative.classList.add("selected");
			} else if (correctionStatus[questionNumber-1].isCorrect) {
				alternative.classList.add("correct");
			} else {
				alternative.classList.add("wrong");
			}
		} else if (isFinished && correctionStatus[questionNumber-1].correctAnswer == 
			alternative.getAttribute("alternative")) {
			alternative.classList.add("rightAnswer");
		}
	});
	programStatus("Alternatives classes setted.");
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
		questionAnswers[questionNumber-1] = undefined;
		programStatus("Alternative unselected");
		return;
	}
	const alternativesDOM = document.querySelectorAll(".alternative");
	alternativesDOM.forEach((alternative) => {
		if (alternative.classList.contains("selected")) {
			alternative.classList.remove("selected");
		}
	});
	selected.classList.add("selected");
	divStatus.classList.add("selected");
	divStatus.classList.remove("notSelected");
	questionAnswers[questionNumber-1] = selected.getAttribute("alternative");

	programStatus("Alternative selected");
}

// get div status according to the current question number
function getDivStatus () {
	var divQuestionStatus;
	document.querySelectorAll(".divQuestionStatus").forEach((div) => {
		if (div.innerText == questionNumber) {
			divQuestionStatus = div;
		}
	});
	return divQuestionStatus;
}

// set all the div status
function setDivTestStatus (numberOfQuestions) {
	const divTestStatus = document.getElementById("divTestStatus");

	for (var i = 0; i < numberOfQuestions; i++) {
		var divQuestionStatus = document.createElement("button");
		divQuestionStatus.classList.add("notSelected", "statusStyle", "divQuestionStatus");
		var divTextContent = document.createTextNode(i+1);
		divQuestionStatus.appendChild(divTextContent);
		divQuestionStatus.addEventListener('click', (event) => {
			questionNumber = parseInt(event.target.innerText);
			getQuestion(questionNumber.toString());
			programStatus("Changing question.")
		});
		divTestStatus.appendChild(divQuestionStatus);
	}
	programStatus("divtestStatus setted.")
}

// listener to the button to go to next question
document.getElementById("nextQuestion").addEventListener('click', (event) => {
	if (questionNumber >= numberOfQuestions) { return; }
	questionNumber++;
	programStatus("Changing to the next question.");
	getQuestion(questionNumber.toString());
})
// listener to the button to go to previous question
document.getElementById("previousQuestion").addEventListener('click', (event) => {
	if (questionNumber <= 0) { return; }
	questionNumber--;
	programStatus("Changing to the previous question.");
	getQuestion(questionNumber.toString());
})
// listener to links to check if user wants to end the test
document.querySelectorAll("a").forEach((link) => {
	link.addEventListener('click', (event) => {
		if (!confirm("Essa ação terminará com a execução do simulado!")) {
			event.preventDefault();
		}
	});
});

// listener to endTest button. Make the test correction
document.getElementById("endTest").addEventListener('click', correctTest);
function correctTest() {
	isFinished = true;
	var questionsCollectionReference = collection(db, 'questions');
	var q = query(questionsCollectionReference, where("testId", "==", testId));

	getDocs(q)
	.then((snapshot) => {
		var correctionQuestionNumber;
		snapshot.docs.forEach((question) => {
			correctionQuestionNumber = parseInt(question.data().number);
			if (question.data().correctAlternative == 
				questionAnswers[correctionQuestionNumber-1]) {
				correctionStatus[correctionQuestionNumber-1] = 
			{"isCorrect": true, "correctAnswer": question.data().correctAlternative};
			} else {
				correctionStatus[correctionQuestionNumber-1] = 
				{"isCorrect": false, "correctAnswer": question.data().correctAlternative};
			}
		})
		setAlternativesClasses();
		printCorrection();
		setDivStatusCorrection();
		clearInterval(setIntervalId);
	})
	.catch((err) => {
		programStatus("Error in correctTest: " + err);
	})
}

// print the correction on log
function printCorrection() {
	programStatus("Correction")
	for (var i = 0; i < numberOfQuestions; i++) {
		programStatus("question " + (i+1) + ": " + correctionStatus[i].isCorrect);
	}
}

// set the classes in the divs status
function setDivStatusCorrection() {
	var divs = document.querySelectorAll(".divCircle");
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
			testTime = 60*doc.data().time;
			document.querySelector("#testTime").innerText = formateTime(testTime);
			document.querySelector("#test-name").innerText = doc.data().name;
		});
}

function setTestTime() {
	if (isFinished) {return}
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
	document.querySelector("#testTime").innerText = formateTime(testTime);
}

function formateTime(testTime) {
	var timeFormate = testTime;
	var hours = Math.floor(timeFormate/(60*60));
	timeFormate -= hours*(60*60);
	var minutes = Math.floor(timeFormate/60);
	timeFormate -= minutes*60;
	var seconds = timeFormate;
	
	return hours+"h "+minutes+"m "+seconds+"s";
}


// general function. print program status
function programStatus(message) {
	console.log(message);
}