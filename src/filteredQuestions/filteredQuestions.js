import { db } from '../firebaseConfigs.js'
import { collection } from 'firebase/firestore'
import { getQueries, getFilteredQuestions } from './filterQuestions.js'
import { getFilteredDocsArray, getSingleDocumentById } from '../general/dataBase.js' 
import { setQuestion, setSupplementaryText, setAlternativesClasses, setAlternativesContent } from '../testSimulates/DOM.js'

// global variables
var questionsIdArray;
window.addEventListener("load", async () => {
	questionsIdArray = await getFilteredQuestions(getQueries());
	const questionObj = await getSingleDocumentById(db, "questions", questionsIdArray[0][0]);
	const alternativesObjArray = await getFilteredDocsArray("questionId", questionObj.id, collection(db, 'alternatives'));
	var supplementaryText = await getSingleDocumentById(db, "supplementaryTexts", questionObj.data.supplementaryTextId);

	setQuestion(questionObj.data);
	//setSupplementaryText(supplementaryText.data.content);
	setAlternativesContent(alternativesObjArray);

})

export { db }