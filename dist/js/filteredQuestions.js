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

// global variables
var filteredQuestionsArray = [];
var queries = []


function getQueries() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.getAll("inst")) {
        urlParams.getAll("inst").forEach((tag) => { queries.push({ "parameter": "institution", "value": tag }); })
    }
    if (urlParams.getAll("subj")) {
        urlParams.getAll("subj").forEach((tag) => { queries.push({ "parameter": "subject", "value": tag }); })
    }
    getFilteredQuestions();
}
getQueries();



function getFilteredQuestions() {
    queries.forEach(async (querie) => {
         if (querie.parameter == "institution") {
             var institutionId = await getFilteredDocsId("name", querie.value, collection(db, 'institutions'));
             if (institutionId.length != 0) { 
                 var testsId = await getFilteredDocsId("institutionId", institutionId[0], collection(db, "tests"));
             }
             if (testsId.length != 0) {
                var questionsId = getFilteredQuestionsArray(testsId);
                console.log(questionsId[0])
                if (questionsId[0] != undefined) { filteredQuestionsArray.push(questionsId); console.log(filteredQuestionsArray)
                } 
                
             }
         }

         if (querie.parameter == "subject") {
            var questionsId = await getFilteredDocsId("subject", querie.value, collection(db, "questions"));
            if (questionsId.length != 0) { filteredQuestionsArray.push(questionsId); } 
         }
    })
   
}

function getFilteredQuestionsArray(testsId) {
    var filteredQuestions = [];
    testsId.forEach(async (test) => {
        var questionId = await getFilteredDocsId("testId", test, collection(db, "questions"))
        filteredQuestions.push(questionId);
        console.log(questionId)
    })
    console.log(filteredQuestions[0])
    return filteredQuestions;
}

async function getFilteredDocsId(attribute, value, col) {
    var q = query(col, where(attribute, "==", value));
    const docsArray = await getDocs(q)
        .then((snapshot) => {
            var returnDocsArray = [];
            snapshot.docs.forEach((doc) => {  returnDocsArray.push(doc.id); })
            return returnDocsArray;
        }).catch((err) => {
            console.log("Error in getDocument: " + err);
        })
    return docsArray;
}



