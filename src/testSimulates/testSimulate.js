// imports
import { db } from '../firebaseConfigs.js'
import { setQuestion, setAlternativesContent, setSupplementaryText 
} from './DOM.js'
import { getFilteredDocsArray, getSingleDocumentById } from '../general/dataBase.js' 
import { setUndefinedArray, sortArray } from '../general/generalScripts.js'
import { setListeners } from './listeners.js'
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

// set test time and infos
window.addEventListener("load", async () => {
	const testDoc = await getSingleDocumentById(db, 'tests', testId);
	document.querySelector("#test-year").innerText = testDoc.data.year;
	const institutionDoc = await getSingleDocumentById(db, 'institutions', testDoc.data.institutionId);
	testTime = 60 * institutionDoc.data.time;
	document.querySelector("#testTime").innerText = formateTime(testTime);
	document.querySelector(".institution-name").innerText = institutionDoc.data.name;
})

document.querySelector("#btnStartTest").addEventListener('click', async () => {
	console.log("Starting Simulate.")
	questionsObjArray = sortArray(await getFilteredDocsArray("testId", testId, collection(db, 'questions')));
	numberOfQuestions = questionsObjArray.length;
	questionAnswers = setUndefinedArray(numberOfQuestions);
	correctionStatus = setUndefinedArray(numberOfQuestions);
	for (var i = 0; i < numberOfQuestions; i++) {
		alternativesObjArray[i] = await getFilteredDocsArray("questionId", questionsObjArray[i].id, collection(db, 'alternatives'));
	}
	for (var i = 0; i < questionsObjArray.length; i++) {
		if (supplementaryTextArray.includes(questionsObjArray[i].data.supplementaryTextId)) { continue; }
		if (questionsObjArray[i].data.supplementaryTextId == "none") { continue; }
		supplementaryTextArray.push(await getSingleDocumentById(db, "supplementaryTexts", questionsObjArray[i].data.supplementaryTextId));
	}
	setQuestion(questionsObjArray[questionNumber - 1].data);
	setSupplementaryText(undefined, questionsObjArray[questionNumber - 1].data.supplementaryTextId, supplementaryTextArray);
	setAlternativesContent(alternativesObjArray[questionNumber - 1]);
	//setDivTestStatus(numberOfQuestions);
	//getDivStatus(questionNumber).classList.add("activeQuestion");

	setListeners ();

	pointerTime = new Date().getSeconds();
	testTimeInterval = setInterval(() => { setTestTime(isFinished, testTime, pointerTime) }, 1000);
	if (document.querySelector("#timerDiv").getAttribute("setted") == "true") {
		testTime = parseInt(document.querySelector("#hour").value) * 60 * 60 +
			parseInt(document.querySelector("#minute").value) * 60;
	}
});

// setter functions
function setNumber(number) { questionNumber = number; }
function setTestTimeValue(newValue) { testTime = newValue; }
function setPoiterTime(newValue) { pointerTime = newValue; }
function setIsFinished(newValue) { isFinished = newValue; }
function setQuestionAnswer(index, newValue) {questionAnswers[index] = newValue; }
function setCorrectionStatus(index, newValue) {correctionStatus[index] = newValue; }

export { questionsObjArray, questionNumber, numberOfQuestions, isFinished, setCorrectionStatus,
    setNumber, questionAnswers, correctionStatus, alternativesObjArray, setQuestionAnswer,
    supplementaryTextArray, setTestTimeValue, setPoiterTime, setIsFinished, testTimeInterval };