import {
	collection, addDoc, doc, updateDoc, deleteField
} from 'firebase/firestore'
import { getFilteredDocsArray, getDocsArray, getSingleDocumentById, deleteDocs } from '../general/dataBase.js'
import { db } from '../firebaseConfigs.js'


var correctAlternative;

document.querySelectorAll(".btnAlternative").forEach((btn) => {
	addEventListener('click', (event) => {
		correctAlternative = event.target.getAttribute("alternative");
	});
});


// event Listener to register the question
document.getElementById("registerBtn").addEventListener('click', async () => {
	var supplementaryTextId = await setSupplementaryText();

	await addQuestion(collection(db, 'questions'), supplementaryTextId);

	var questionId = await getDocId();
	var alternatives = getAlternatives();

	registerAlternatives(alternatives, questionId);
	resetInputs();
	programStatus("finished");
	programStatus("--------------------------------")
});

async function setSupplementaryText() {
	var supplementaryTextValue = document.querySelector("#supplementaryText").value;
	var supplementaryTexts = await getFilteredDocsArray("content", supplementaryTextValue, collection(db, "supplementaryTexts"));

	if (supplementaryTexts != "") { return supplementaryTexts[0].id; }
	
	await addDoc(collection(db, 'supplementaryTexts'), {
		content: supplementaryTextValue,
		lastAdded: true
	})
	return await getDocId("supplementaryTexts")

}

async function addQuestion(collectionRef, supplementaryTextId) {
	var subjectIndex = document.querySelector("#subjects").selectedIndex;
	var subjectValue = document.querySelector("#subjects").querySelectorAll("option")[subjectIndex].getAttribute("id");;
	var subSubjectIndex = document.querySelector("#subSubjects").selectedIndex;
	var subSubjectValue = document.querySelector("#subSubjects").querySelectorAll("option")[subSubjectIndex].getAttribute("id");;

	await addDoc(collection(db, 'questions'), {
		testId: document.getElementById("testId").value,
		content: document.getElementById("questionContent").value,
		number: document.getElementById("questionNumber").value,
		correctAlternative: correctAlternative,
		suject: subjectValue,
		subSubject: subSubjectValue,
		supplementaryTextId: supplementaryTextId,
		lastAdded: true
	})
}

async function getDocId(col) {
	var document = await getFilteredDocsArray("lastAdded", true, collection(db, col));
	updateDoc(doc(db, col, document[0].id), {
		lastAdded: deleteField()
	});
	return document[0].id;;
}

function getAlternatives() {
	var alternativesArray = [];
	var alternatives = document.getElementById("alternativeContent").value;

	let index = 4;

	for (var i = 0; i < alternatives.length; i++) {
		var thisChar = alternatives.charAt(i);
		var nextChar = alternatives.charAt(i + 1);
		var thirdChar = alternatives.charAt(i + 2);
		if (thisChar == '(' && thirdChar == ')') {
			if (nextChar == 'B') {
				alternativesArray.push(
					{ "content": alternatives.slice(index, i), "alternative": "A" });
			}
			if (nextChar == 'C') {
				alternativesArray.push(
					{ "content": alternatives.slice(index, i), "alternative": "B" });
			}
			if (nextChar == 'D') {
				alternativesArray.push(
					{ "content": alternatives.slice(index, i), "alternative": "C" });
			}
			if (nextChar == 'E') {
				alternativesArray.push(
					{ "content": alternatives.slice(index, i), "alternative": "D" });
			}
			index = i + 4;
		}
	}
	alternativesArray.push(
		{ "content": alternatives.slice(index, alternatives.length), "alternative": "E" });
	return alternativesArray;
}


function registerAlternatives(alternatives, questionId) {
	alternatives.forEach((alternativeObj) => {
		addDoc(collection(db, 'alternatives'), {
			questionId: questionId,
			content: alternativeObj.content,
			alternative: alternativeObj.alternative
		})
		programStatus("Alternative added.");
	})
}

function resetInputs() {
	// questionText.value = "";
	// document.getElementById("alternativeConent").value = "";
	// document.getElementById("questionNumber").value = parseInt(document.getElementById("questionNumber").value) + 1;
}
//

function programStatus(text) { console.log(text); }

function error(errorValue) { alert(errorValue); }

document.querySelector("#subjects").addEventListener('click', async () => {
	setSubSubjects();
})

document.querySelector("#newSubjectButton").addEventListener('click', async () => {
	var subject = document.querySelector("#newSubjectInput");

	if (subject.value == "") {
		error("matéria não definida");
		return;
	}

	var subjectindb = await getFilteredDocsArray("content", subject.value, collection(db, "subjects"));
	if (subjectindb != undefined) {
		error("matéria já existe");
		return;
	}

	addDoc(collection(db, 'subjects'), {
		content: subject.value,
		lastAdded: true
	})
	setSubjectContentInHTML(await getSingleDocumentById(db, "subjects", await getDocId('subjects')));
})

document.querySelector("#newSubSubjectButton").addEventListener('click', async () => {
	var subSubject = document.querySelector("#newSubSubjectInput");

	if (subSubject.value == "") {
		error("sub matéria não definida");
		return;
	}

	var subjectindb = await getFilteredDocsArray("content", subSubject.value, collection(db, "subSubjects"));
	if (subjectindb != undefined) {
		error("sub matéria já existe");
		return;
	}
	var selectedIndex = document.querySelector("#subjects").selectedIndex;
	var subjectId = document.querySelector("#subjects").querySelectorAll("option")[selectedIndex].getAttribute("value");	

	addDoc(collection(db, 'subSubjects'), {
		content: subSubject.value,
		ssbjectId: subjectId,
		lastAdded: true
	})
	setSubjectContentInHTML(await getSingleDocumentById(db, "subSubjects", await getDocId('subSubjects')));
})

async function setSubjects() {
	var subjects = await getDocsArray(collection(db, "subjects"));
	if (subjects == undefined) { return; }
	console.log(subjects)
	subjects.forEach((subject) => {
		setSubjectContentInHTML(subject);
	})
}

function setSubjectContentInHTML(subject) {
	var option = document.createElement("option");
	option.setAttribute("value", subject.data.content);
	option.setAttribute("id", subject.id);
	var text = document.createTextNode(subject.data.content);
	option.appendChild(text);
	document.querySelector("#subSubjects").appendChild(option);
}

async function setSubSubjects() {
	if (subSubjects == undefined) { return; }
	unsetSUbSUbjects();
	var copySubSubjects = [];
	subSubjects.forEach((subSubject) => {
		var selectedIndex = document.querySelector("#subjects").selectedIndex;
		if (document.querySelector("#subjects").querySelectorAll("option")[selectedIndex].getAttribute("id") == subSubject.data.subjectId) {
			copySubSubjects.push(subSubject);
		}
	})
	if (copySubSubjects.length == 0) { return; }
	copySubSubjects.forEach((element) => {
		setSubSubjectContentInHTML(element);
	})
}

function unsetSUbSUbjects() {
	var options = document.querySelector("#subSubjects").querySelectorAll("option");
	if (options == undefined) { return; }
	options.forEach((element) => {
		if (element.value != "none") {
			element.remove();
		}
	})
}

function setSubSubjectContentInHTML(subSubject) {
	var option = document.createElement("option");
	option.setAttribute("value", subSubject.data.content);
	option.setAttribute("id", subSubject.id);
	var text = document.createTextNode(subSubject.data.content);
	option.appendChild(text);
	document.querySelector("#subSubjects").appendChild(option);
}

document.querySelector("#delete").addEventListener("click", async () => {
	var selectedIndex = document.querySelector("#deleteOp").selectedIndex;
	var selectedValue = document.querySelector("#deleteOp").querySelectorAll("option")[selectedIndex].getAttribute("value");	

	deleteDocs(selectedValue);
})

var subSubjects;
window.addEventListener("load", async () => {
	await setSubjects();
	//subSubjects = await getDocsArray(collection(db, "subSubjects"));
	//setSubSubjects();
})