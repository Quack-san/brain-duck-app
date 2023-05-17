// imports
import { db } from '../firebaseConfigs.js'
import { collection } from 'firebase/firestore'
import { setQuestion, setAlternativesContent, setSupplementaryText, changeTestDisplay, setDivTestStatus, getDivStatus, setQuestionImage
} from './DOM.js'
import { getFilteredDocsArray, getSingleDocumentById } from '../general/dataBase.js' 
import { setUndefinedArray, sortArray } from '../general/generalScripts.js'
import { setListeners, hasTime } from './listeners.js'
import { setTestTime, formateTime } from './timer.js'

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
var testTimeInterval;
var checkt;

var referenceTime;
var totalTime = 0;
var pointerTime;
// set test time and infos
window.addEventListener("load", async () => {
	referenceTime = new Date().getSeconds();
	checkt = setInterval(checkTime, 1000);
	const testDoc = await getSingleDocumentById(db, 'tests', testId);
	clearInterval(checkt);
	document.querySelector("#test-year").innerText = testDoc.data.year;
	const institutionDoc = await getSingleDocumentById(db, 'institutions', testDoc.data.institutionId);
	testTime = 60 * institutionDoc.data.time;
	document.querySelector("#testTime").innerText = formateTime(testTime);
	document.querySelector("#test-name").innerText = institutionDoc.data.name;
	setQuestionImage("none");
})


function checkTime() {
	pointerTime = new Date().getSeconds();
	totalTime += referenceTime<pointerTime? pointerTime-referenceTime : 60-referenceTime+pointerTime;
	referenceTime = new Date().getSeconds();
	if (totalTime >= 5) {
		console.log("bah")
		clearInterval(checkt);
	}
}

document.querySelector("#btnStartTest").addEventListener('click', async () => {
	console.log("Starting Simulate.");
	changeTestDisplay("loading");
	questionsObjArray = sortArray(await getFilteredDocsArray("testId", testId, collection(db, 'questions')));
	numberOfQuestions = questionsObjArray.length;
	questionAnswers = setUndefinedArray(numberOfQuestions);
	correctionStatus = setUndefinedArray(numberOfQuestions);
	for (var i = 0; i < numberOfQuestions; i++) {
		alternativesObjArray[i] = await getFilteredDocsArray("questionId", questionsObjArray[i].id, collection(db, 'alternatives'));
	}
	var supplementaryTextIdArray = [];
	for (var i = 0; i < questionsObjArray.length; i++) {
		if (supplementaryTextIdArray.includes(questionsObjArray[i].data.supplementaryTextId)) { continue; }
		if (questionsObjArray[i].data.supplementaryTextId == "none") { continue; }
		supplementaryTextIdArray.push(questionsObjArray[i].data.supplementaryTextId);
	}
	for (var i = 0; i < supplementaryTextIdArray.length; i++) {
		supplementaryTextArray[i] = await getSingleDocumentById(db, "supplementaryTexts", supplementaryTextIdArray[i]);
	}
	
	setQuestion(questionsObjArray[questionNumber - 1].data);
	setQuestionImage(questionsObjArray[questionNumber - 1].data.imageURL);
	setSupplementaryText(questionsObjArray[questionNumber - 1].data.supplementaryTextId, supplementaryTextArray);
	setAlternativesContent(alternativesObjArray[questionNumber - 1]);
	setDivTestStatus(numberOfQuestions);
	getDivStatus(questionNumber).classList.add("activeQuestion");

	setListeners ();

	pointerTime = new Date().getSeconds();
	// if (document.querySelector("#timerDiv").getAttribute("setted") == "true") {
	// 	testTime = parseInt(document.querySelector("#hour").value) * 60 * 60 +
	// 		parseInt(document.querySelector("#minute").value) * 60;
	// }
	if (hasTime) {
		testTimeInterval = setInterval(() => { setTestTime(isFinished, testTime, pointerTime) }, 1000);
	}

	changeTestDisplay("finished");
});

// setter functions
function setNumber(number) { questionNumber = number; }
function setTestTimeValue(newValue) { testTime = newValue; }
function setPoiterTime(newValue) { pointerTime = newValue; }
function setIsFinished(newValue) { isFinished = newValue; }
function setQuestionAnswer(index, newValue) { questionAnswers[index] = newValue; }
function setCorrectionStatus(index, newValue) { correctionStatus[index] = newValue; }

export { questionsObjArray, questionNumber, numberOfQuestions, isFinished, setCorrectionStatus,
    setNumber, questionAnswers, correctionStatus, alternativesObjArray, setQuestionAnswer,
    supplementaryTextArray, setTestTimeValue, setPoiterTime, setIsFinished, testTimeInterval };