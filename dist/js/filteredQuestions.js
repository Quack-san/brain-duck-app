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
    var promises = [];
    queries.forEach((querie) => {
        promises.push(filterDocsPromise(querie));
    })
    Promise.all(promises).then((questions) => {
        for (var i = 0; i < questions.length; i++) {
            if (questions[i] == undefined) {
                showError("Questões não encontrdas :<");
                return;
            }
        }
        if (queries.length == 1) { filteredQuestionsArray = questions; }
        else { filteredQuestionsArray = compareQuestionsFilter(questions); }
        console.log(filteredQuestionsArray)
        
    })
}
function filterDocsPromise(querie) {
    return new Promise(async (resolve, reject) => {
        if (querie.parameter == "institution") {
            var institutionId = await getFilteredDocsId("name", querie.value, collection(db, 'institutions'));
            if (institutionId != undefined) {
                var testsId = await getFilteredDocsId("institutionId", institutionId[0], collection(db, "tests"));
            }
            if (testsId != undefined && institutionId != undefined) {
                var questionsId = await getFilteredQuestionsArray(testsId);
                if (questionsId != undefined) {
                    resolve(questionsId);
                }
            }
        }

        if (querie.parameter == "subject") {
            var questionsId = getFilteredDocsId("subject", querie.value.toLowerCase(), collection(db, "questions"));
            if (questionsId != undefined) {
                resolve(questionsId);
            }
        }
        resolve(undefined);
    })
}

async function getFilteredDocsId(attribute, value, col) {
    var q = query(col, where(attribute, "==", value));
    var docsArray = await getDocs(q)
        .then((snapshot) => {
            var returnDocsArray = [];
            snapshot.docs.forEach((doc) => { returnDocsArray.push(doc.id); })
            return returnDocsArray;
        }).catch((err) => {
            console.log("Error in getDocument: " + err);
        })
    if (docsArray.length == 0) { docsArray = undefined; }
    return docsArray;
}


async function getFilteredQuestionsArray(testsId) {
    var returnQuestions = [];
    var promises = [];
    testsId.forEach(async (test) => {
        promises.push(new Promise(async (resolve, reject) => {
            var filteredQuestions = [];
            var questionId = await getFilteredDocsId("testId", test, collection(db, "questions"))
            questionId.forEach((question) => {
                filteredQuestions.push(question);
            })
            if (filteredQuestions.length == 0) { filteredQuestions = undefined; }
            resolve(filteredQuestions);
        }))
    })
    returnQuestions = await Promise.all(promises).then((questions) => {
        var returnValues = [];
        for (var i = 0; i < questions.length; i++) {
            questions[i].forEach((question) => {
                if (question == undefined) { return; }
                returnValues.push(question);
            })
        }
        return returnValues;
    })
    if (returnQuestions.length == 0) { return undefined; }
    return returnQuestions;
}

function compareQuestionsFilter(questions) {
    var copyArray = [];
    for (var i = 0; i < questions.length; i++) {
        for (var j = 0; j < questions[i].length; j++) {
            if (copyArray.includes(questions[i][j])) { continue; }
            if (!compareElementsInArray(i, j, questions)) { continue; }
            copyArray[copyArray.length] = questions[i][j]
        }
    }
    return copyArray;
}
function compareElementsInArray(indexArray, indexItem, array) {
    var matchings = 0;
    for (var i = 0; i < array.length; i++) {
        if (i == indexArray) { continue; }
         for (var j = 0; j < array[i].length; j++) {
            if (array[indexArray][indexItem] != array[i][j]) { continue; }
            matchings++;
        }
    }
    if (matchings == array.length - 1) { return true; }
    return false;
}

function showError(message) {
    window.alert(message)
}