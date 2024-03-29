import { collection } from 'firebase/firestore'
import { getFilteredDocsArray, getSingleDocumentById } from '../general/dataBase.js'
import { db } from './filteredQuestions.js'

function getQueries() {
    var queries = [];
    const urlParams = new URLSearchParams(window.location.search);

    const possibleTags = ["institution", "subject", "subSubject"];

    possibleTags.forEach((tag) => {
        if (urlParams.getAll(tag)) {
            urlParams.getAll(tag).forEach((tagValue) => { 
                queries.push({ "parameter": tag, "value": tagValue }); 
            })
        }
    })
    return queries;
}

async function getFilteredQuestions(queries) {
    var promises = [];
    queries.forEach((querie) => {
        promises.push(filterDocsPromise(querie));
    }) 
    var returnArray = [];
    await Promise.all(promises).then((questions) => {
        questions.forEach((question) => {
            if (question == undefined) { return; }
            returnArray.push(question);
        })
    })
    var arrayCopy = [];

    // matrix to vector without duplicated values
    for (let i = 0; i < returnArray.length; i++) {
        for (let j = 0; j < returnArray[i].length; j++) {
            if (!arrayCopy.includes(returnArray[i][j])) { arrayCopy.push(returnArray[i][j]); }
        }
    }
    returnArray = arrayCopy;

    if (returnArray.length == 0) { return undefined; }
    return returnArray;
}

function filterDocsPromise(querie) {
    return new Promise(async (resolve, reject) => {
        if (querie.parameter == "institution") {
            var institutionId = await getSingleDocumentById(db, 'institutions', querie.value);
            if (institutionId != undefined) {
                var testsId = await getFilteredDocsArray("institutionId", institutionId.id, collection(db, "tests"), false);
            }
            if (testsId != undefined && institutionId != undefined) {
                var questionsId = await getFilteredQuestionsArray(testsId);
                if (questionsId != undefined) {
                    resolve(questionsId);
                }
            }
        }

        if (querie.parameter == "subject") {
            var questionsId = await getFilteredDocsArray("subject", querie.value, collection(db, "questions"), false);
            if (questionsId != undefined) {
                resolve(questionsId);
            }
        }
        if (querie.parameter == "subSubject") {
            var questionsId = await getFilteredDocsArray("subSubject", querie.value, collection(db, "questions"), false);
            if (questionsId != undefined) {
                resolve(questionsId);
            }
        }
        resolve(undefined);
    })
}

async function getFilteredQuestionsArray(testsId) {
    var promises = [];
    testsId.forEach(async (test) => {
        const newPromise = new Promise(async (resolve, reject) => {
                resolve(await getFilteredDocsArray("testId", test, collection(db, "questions"), false));
            })
        promises.push(newPromise);
    })
    return await Promise.all(promises).then((questions) => {
        var returnArray = [];
        questions.forEach((questionArray) => {
            if (questionArray == undefined) { return undefined; }
            else { questionArray.forEach((question) => { returnArray.push(question); })}
        })
        return returnArray;
    })
}

export { getQueries, getFilteredQuestions };