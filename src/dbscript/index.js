import {
	collection, addDoc, doc, updateDoc, deleteField
} from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getFilteredDocsArray, getDocsArray, getSingleDocumentById, deleteDocs } from '../general/dataBase.js'
import { db } from '../firebaseConfigs.js'

const PASSWORD = "s1e2n3h4a5";
document.querySelector("#checkPassword").addEventListener("click", () => {
	if (document.querySelector("#password").value == PASSWORD) {
		document.querySelector("#form").style.display = "block";
		document.querySelector("#passwordDiv").style.display = "none";
	} else {
		alert("!!!! ALERTA ALERTA ALERTAA  !!!!")
	}
})
var correctAlternative;

window.addEventListener("load", async () => {
	await setItemsSelect("subjects");
	setItemsSelect("subSubjects");
});

document.querySelectorAll(".btnAlternative").forEach((btn) => {
	btn.addEventListener('click', (event) => {
		correctAlternative = event.target.getAttribute("alternative");
	});
});


// event Listener to register the question
document.getElementById("registerBtn").addEventListener('click', async () => {
	var supplementaryTextId = await setSupplementaryText();

	const imageURL = await setImage();
	await addQuestion(collection(db, 'questions'), supplementaryTextId, imageURL);

	var questionId = await getDocId("questions");
	var alternatives = getAlternatives();

	registerAlternatives(alternatives, questionId);
	resetInputs();
	programStatus("finished");
	programStatus("--------------------------------");
});

async function setImage() {
	const storage = getStorage();
	const file = document.querySelector("#image").files[0];
	if (file == undefined) { return "none"; }

    const reference = ref(storage, "images/" +  document.querySelector("#testId").value+document.querySelector("#questionNumber").value+"image.png");
    const metadata = { contentType: file.type  };

	return new Promise((resolve) => {
		const task = uploadBytesResumable(reference, file, metadata);
		task.on("state-changed", async () => {
			await getDownloadURL(task.snapshot.ref).then((downloadURL) => {
				resolve(downloadURL);
			})
		})
	})
}

async function setSupplementaryText() {
	var supplementaryTextValue = document.querySelector("#supplementaryText").value;
	var supplementaryTexts = await getFilteredDocsArray("content", supplementaryTextValue, collection(db, "supplementaryTexts"));

	if (supplementaryTexts != undefined) { return supplementaryTexts[0].id; }
	
	await addDoc(collection(db, 'supplementaryTexts'), {
		content: supplementaryTextValue,
		lastAdded: true
	})
	return await getDocId("supplementaryTexts")

}

async function addQuestion(collectionRef, supplementaryTextId, imageURL) {
	var subjectIndex = document.querySelector("#subjects").selectedIndex;
	var subjectValue = document.querySelector("#subjects").querySelectorAll("option")[subjectIndex].getAttribute("id");;
	var subSubjectIndex = document.querySelector("#subSubjects").selectedIndex;
	var subSubjectValue = document.querySelector("#subSubjects").querySelectorAll("option")[subSubjectIndex].getAttribute("id");;

	await addDoc(collection(db, 'questions'), {
		testId: document.getElementById("testId").value,
		content: document.getElementById("questionContent").value,
		number: document.getElementById("questionNumber").value,
		correctAlternative: correctAlternative,
		subject: subjectValue,
		subSubject: subSubjectValue,
		supplementaryTextId: supplementaryTextId,
		imageURL: imageURL,
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
	document.getElementById("questionContent").value = "";
	document.getElementById("supplementaryText").value = "";
	document.getElementById("alternativeContent").value = "";
	document.getElementById("questionNumber").value = parseInt(document.getElementById("questionNumber").value) + 1;
	document.getElementById("subjects").value = "none";
	document.getElementById("subSubjects").value = "none";
}

function programStatus(text) { console.log(text); }

function error(errorValue) { alert(errorValue); }

document.querySelector("#subjects").addEventListener("click", (event) => {
	setItemsSelect("subSubjects");
})

async function setItemsSelect(collectionName) {
	var docs = await getDocsArray(collection(db, collectionName));

	if (collectionName == "subSubjects") { unsetSubSubjects(); docs = await getSubSubjects(docs); }

	if (docs == undefined) { return; }
	docs.forEach((doc) => {
		setHtmlOption(doc, collectionName);
	})
}

function getSubSubjects(subSubjects) {
	if (subSubjects == undefined) { return undefined; }
	var copySubSubjects = [];

	subSubjects.forEach((subSubject) => {
		var selectedIndex = document.querySelector("#subjects").selectedIndex;
		if (document.querySelector("#subjects").querySelectorAll("option")[selectedIndex].getAttribute("id") == subSubject.data.subjectId) {
			copySubSubjects.push(subSubject);
		}
	})
	if (copySubSubjects.length == 0) { return undefined; }
	return copySubSubjects;
}

function unsetSubSubjects() {
	var options = document.querySelector("#subSubjects").querySelectorAll("option");
	if (options == undefined) { return; }
	options.forEach((element) => {
		if (element.value != "none") {
			element.remove();
		}
	})
}

function setHtmlOption(subject, parenteClass) {
	var option = document.createElement("option");
	option.setAttribute("value", subject.data.content);
	option.setAttribute("id", subject.id);
	var text = document.createTextNode(subject.data.content);
	option.appendChild(text);
	document.querySelector("#"+parenteClass).appendChild(option);
}


document.querySelector("#newSubjectButton").addEventListener("click", (event) => {
	setNewItem("newSubjectInput", "subjects");
});
document.querySelector("#newSubSubjectButton").addEventListener("click", (event) => {
	setNewItem("newSubSubjectInput", "subSubjects");
})

async function setNewItem(inputId, collectionName) {
	var input = document.querySelector("#"+ inputId);

	if (input.value == "") {
		error("valor do input não definido");
		return;
	}

	var dbElement = await getFilteredDocsArray("content", input.value, collection(db, collectionName));
	if (dbElement != undefined) {
		error("documento já existe");
		return;
	}
	if (collectionName == "subjects") {
		addDoc(collection(db, collectionName), {
			content: input.value,
			lastAdded: true
		});
	} else {
		var selectedIndex = document.querySelector("#subjects").selectedIndex;
		var subjectId = document.querySelector("#subjects").querySelectorAll("option")[selectedIndex].getAttribute("id");	
		addDoc(collection(db, collectionName), {
			content: input.value,
			subjectId: subjectId,
			lastAdded: true
		})
	}
	setHtmlOption(await getSingleDocumentById(db, collectionName, await getDocId(collectionName)), collectionName);
}

document.querySelector("#delete").addEventListener("click", async () => {
	var selectedIndex = document.querySelector("#deleteOp").selectedIndex;
	var selectedValue = document.querySelector("#deleteOp").querySelectorAll("option")[selectedIndex].getAttribute("value");	

	deleteDocs(selectedValue);
})

