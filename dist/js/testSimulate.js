// firebase configs / imports
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, doc, onSnapshot, query, where
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
var questionAnswers = [];
for (var i = 0; i < questionNumber; i++) {
	questionAnswers[i] = undefined;
}

function getTestId() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('testId');
}

// call the function
getQuestion(questionNumber.toString());
setDivTestStatus(numberOfQuestions);

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

function setQuestion(question) {
	document.getElementById("questionNumber").innerText = question.data().number;
	document.getElementById("questionContent").innerText = question.data().text;
	programStatus("Question setted.");
}

function getAlternatives(questionId) {
	var alternativesCollectionReference = collection(db, 'alternatives');
	var q = query(alternativesCollectionReference, where("questionId", "==", questionId));

	var alternatives = [];
	getDocs(q)
	.then((snapshot) => {
		snapshot.docs.forEach((alternative) => {
			alternatives.push({
				"id": alternative.id, 
				"content": alternative.data().text
			});
		});
		setAlternatives(alternatives);
		programStatus("Alternatives got.")
	})
	.catch((err) => {
		programStatus("Error in getAlternatives: " + err);
	});
}

function setAlternatives(alternatives) {
	const alternativesDOM = document.querySelectorAll(".alternative");
	var indexAlternative = 0;
	alternativesDOM.forEach((alternative) => {
		if (alternative.classList.contains("selected")) {
			alternative.classList.remove("selected");
		}
		if (questionAnswers[questionNumber-1] != undefined && 
			questionAnswers[questionNumber-1] == alternative.getAttribute("alternative")) {
			alternative.classList.add("selected");
		}
		alternative.innerText = alternatives[indexAlternative].content;
		alternative.addEventListener('click', selectAlternative);
		indexAlternative++;
	});
	programStatus("Alternatives setted.")
}

function selectAlternative(event) {
	var selected = event.target;
	var divStatus = getDivStatus();

	if (selected.classList.contains("selected")) {
		selected.classList.remove("selected");
		divStatus.classList.remove("answered");
		divStatus.classList.add("notAnswered");
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
	divStatus.classList.add("answered");
	divStatus.classList.remove("notAnswered");
	questionAnswers[questionNumber-1] = selected.getAttribute("alternative");

	programStatus("Alternative selected");
}

function getDivStatus () {
	var divStatus;
	document.querySelectorAll(".divCircle").forEach((div) => {
		if (div.innerText == questionNumber) {
			divStatus = div;
		}
	});
	return divStatus;
}


function setDivTestStatus (numberOfQuestions) {
	const divTestStatus = document.getElementById("divTestStatus");

	for (var i = 0; i < numberOfQuestions; i++) {
		var divStatus = document.createElement("div");
		divStatus.classList.add("notAnswered", "divCircle");
		var divTextContent = document.createTextNode(i+1);
		divStatus.appendChild(divTextContent);
		divStatus.addEventListener('click', (event) => {
			questionNumber = parseInt(event.target.innerText);
			getQuestion(questionNumber.toString());
			programStatus("Changing question.")
		});
		divTestStatus.appendChild(divStatus);
	}
	programStatus("divtestStatus setted.")
}

document.getElementById("nextQuestion").addEventListener('click', (event) => {
	if (questionNumber >= numberOfQuestions) { return; }
	questionNumber++;
	programStatus("Changing to the next question.");
	getQuestion(questionNumber.toString());
})
document.getElementById("previousQuestion").addEventListener('click', (event) => {
	if (questionNumber <= 0) { return; }
	questionNumber--;
	programStatus("Changing to the previous question.");
	getQuestion(questionNumber.toString());
})

document.getElementById("linkHome").addEventListener('click', (event) => {
	if (!confirm("Essa ação terminará com a execução do simulado!")) {
		event.preventDefault();
	}
});

// general function. print program status
function programStatus(message) {
	console.log(message);
}