import { db } from '../firebaseConfigs.js'
import { collection } from 'firebase/firestore'
import { getQueries, getFilteredQuestions } from './filterQuestions.js'
import { getFilteredDocsArray, getSingleDocumentById } from '../general/dataBase.js' 
import { setQuestion, setAlternativesClasses, setAlternativesContent } from '../testSimulates/DOM.js'
import { setListeners } from './listeners.js'

// // global variables
var allQuestionsIdArray;
var notAsweredQuestionsIdArray = [];
var questionsIdArray = [];
var questionsArrayObj = [];
var alternativeSelected;
var questionCorrected = false;

window.addEventListener("load", async () => {
	allQuestionsIdArray = await getFilteredQuestions(getQueries());
	if (allQuestionsIdArray.length == 0) { alert("nenhuma questão válida"); return; }

	notAsweredQuestionsIdArray = allQuestionsIdArray;
	setQuestionsIdArray();
	questionsArrayObj = await getQuestionObjArray();
	setQuestionData();
	setListeners();
})

function setQuestionsIdArray() {
	if (notAsweredQuestionsIdArray.length == 0) {
		alert("Você respondeu todas as questões filtradas.");
		window.location.href = "questions.html";
	}
	questionsIdArray = [];
	if (notAsweredQuestionsIdArray.length > 2) {
		for (var i = 0; i < 2; i++) { 
			questionsIdArray.push(notAsweredQuestionsIdArray[0]); 
			notAsweredQuestionsIdArray.shift(); 
		}
	} else {
		notAsweredQuestionsIdArray.forEach((questionId) => {
			questionsIdArray.push(questionId);
		})
		notAsweredQuestionsIdArray = [];
	}
}

async function getQuestionObjArray() {
	var returnArray = [];
	var promisesArray = [];
	questionsIdArray.forEach(async (questionId) => {
		promisesArray.push(getQuestionObjPromisses(questionId));
	});
	await Promise.all(promisesArray).then((element) => {
		returnArray = element;
	})
	return returnArray;
}
async function getQuestionObjPromisses(questionId) {
	return new Promise(async (resolve) => {
		resolve(await getSingleDocumentById(db, 'questions', questionId));
	});
}

async function setQuestionData() {
 	const alternativesObjArray = await getFilteredDocsArray("questionId", questionsArrayObj[0].id, collection(db, 'alternatives'));
 	var supplementaryText = await getSingleDocumentById(db, "supplementaryTexts", questionsArrayObj[0].data.supplementaryTextId);
 	setQuestion(questionsArrayObj[0].data);
 	setSupplementaryText(supplementaryText.data.content);
 	setAlternativesContent(alternativesObjArray);
}

function setSupplementaryText(supplementaryText) {
	var supplementaryTextDiv = document.querySelector("#supplementaryText");
	if (supplementaryText == "none") {
		supplementaryTextDiv.innerText = "Esta questão não possui texto complementar";
		return;
	}
	supplementaryTextDiv.innerText = supplementaryText;
}


document.querySelector("#answerBtn").addEventListener("click", () => {
	questionCorrected = true;
	var corretionStatus = [];
	if (alternativeSelected != undefined) {
		if (alternativeSelected == questionsArrayObj[0].data.correctAlternative) {
			corretionStatus = { "isCorrect": true, "correctAnswer": questionsArrayObj[0].data.correctAlternative };
		}
		else {
			corretionStatus = { "isCorrect": false, "correctAnswer": questionsArrayObj[0].data.correctAlternative };
		}
	}
	else {
		corretionStatus = { "isCorrect": false, "correctAnswer": questionsArrayObj[0].data.correctAlternative };
	}

	document.querySelectorAll(".alternative").forEach((alternative) => {
		changeClasses(alternative, "remove", "selected");

		if (alternativeSelected == alternative.getAttribute("alternative")) {
             if (corretionStatus.correctAnswer == alternativeSelected) 
            	{ changeClasses(alternative, "add", "correct"); } 
            else { changeClasses(alternative, "add", "wrong"); }
		} else if (corretionStatus.correctAnswer == alternative.getAttribute("alternative")) {
			changeClasses(alternative, "add", "rightAnswer");
		}
	});
}) 

document.querySelector("#nextQuestionBtn").addEventListener("click", async () => {
	questionCorrected = false;
	questionsArrayObj.shift();
	if (questionsArrayObj.length == 0) {
		setQuestionsIdArray();
		questionsArrayObj = await getQuestionObjArray();
	}
	document.querySelectorAll(".alternative").forEach((alternative) => {
		changeClasses(alternative, "remove", "selected");
		changeClasses(alternative, "remove", "correct");
		changeClasses(alternative, "remove", "wrong");
		changeClasses(alternative, "remove", "rightAnswer");
	});
	
	setQuestionData();
});

function changeClasses(element, operation, classValue) {
	if (operation == "add" && !element.classList.contains(classValue)) { element.classList.add(classValue); }
	if (operation == "remove" && element.classList.contains(classValue)) { element.classList.remove(classValue); }
}

function setAlternativeSelected (value) { alternativeSelected = value; }

export { db, setAlternativeSelected, questionCorrected }