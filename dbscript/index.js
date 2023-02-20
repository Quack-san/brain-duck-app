// firebase configs
import { initializeApp } from 'firebase/app'
import {
	getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, updateDoc, deleteField
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

initializeApp(firebaseConfig)

// data base
const db = getFirestore()

// get elements from html

const testId = document.getElementById("testId");
const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const alternativeText = document.getElementById("alternativeText");
const registerBtn = document.getElementById("registerBtn");

var docSnapshot = ""; 

// event Listener to register the question
registerBtn.addEventListener('click', registerQuestion);

// main function of the script. 
function registerQuestion() {
	programStatus("Starting process.");
	const questionCollectionReference = collection(db, 'questions');

	// add question
	addDoc(questionCollectionReference, {
		testId: testId.value,
		text: questionText.value,
		number: questionNumber.value,
		lastAdded: true
	})
	.then(() => {
		programStatus("question Added.");

			getDocs(questionCollectionReference)
		.then((snapshot) => {
			// methods continuing the process
			programStatus("Snapshot got.");
			var questionId = getLastDocAddedId(snapshot.docs);
			deleteDocumentField(doc(db, 'questions', questionId));

			var alternatives = getAlternatives();
			registerAlternatives(alternatives, questionId);
			programStatus("finished");
			programStatus("--------------------------------")
		})
		.catch(err => {
			programStatus("Error in getSnapshotDocuments: " + err.message);		
		})
		
	})
	.catch(err => {
		programStatus("Error in register Question: " + err.message);
	})	
}



function getLastDocAddedId(docsSnapshot) {
	var docId;
	docsSnapshot.forEach((question) => {
		if (question.data().lastAdded) { docId = question.id; }
	})
	programStatus("Last question added id got.");
	return docId;
}

function deleteDocumentField(docReference) {
	updateDoc(docReference, {
		lastAdded: deleteField()
	});
	programStatus("Field deleted.");
}

function getAlternatives() {
	var alternativesArray = [];
	var alternatives = alternativeText.value;

	let index = 4;

	for (var i = 0; i < alternatives.length; i++) {
		var thisChar = alternatives.charAt(i);
		var nextChar = alternatives.charAt(i+1);
		var thirdChar = alternatives.charAt(i+2);
		if (thisChar == '(' && thirdChar == ')') {
			if (nextChar == 'B') {
				alternativesArray.push(alternatives.slice(index,i));
			}
			if (nextChar == 'C') {
				alternativesArray.push(alternatives.slice(index,i));
			} 
			if (nextChar == 'D') {
				alternativesArray.push(alternatives.slice(index,i));
			} 
			if (nextChar == 'E') {
				alternativesArray.push(alternatives.slice(index,i));
			}
			index = i+4;  
		}
	}
	alternativesArray.push(alternatives.slice(index,alternatives.length));

	programStatus("Alternatives got.")
	return alternativesArray;
}

function registerAlternatives(alternatives, questionId) {
	const alternativeCollectionReference = collection(db, 'alternatives');
	alternatives.forEach((alternative) => {
		addDoc(alternativeCollectionReference, {
			questionId: questionId,
			text: alternative,
		})
		programStatus("Alternative added.");
	})
}

function programStatus(text) {
	console.log(text);
}