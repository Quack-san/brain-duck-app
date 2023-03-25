import { collection } from 'firebase/firestore'
import { getFilteredDocsArray } from '../general/dataBase.js'
import { db } from './filteredQuestions.js'

function getQueries() {
    var queries = [];
    const urlParams = new URLSearchParams(window.location.search);

    const possibleTags = ["institution", "subject"];

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
    var returnQuestions;
    return await Promise.all(promises).then((questions) => {
        questions.forEach((question) => {
            if (question == undefined) { return undefined; }
        })
        if (queries.length == 1) { return questions; }
        resolve(compareQuestionsFilter(questions));
    })
}
function filterDocsPromise(querie) {
    return new Promise(async (resolve, reject) => {
        if (querie.parameter == "institution") {
            var institutionId = await getFilteredDocsArray("name", querie.value, collection(db, 'institutions'), false);
            if (institutionId != undefined) {
                var testsId = await getFilteredDocsArray("institutionId", institutionId[0], collection(db, "tests"), false);
            }
            if (testsId != undefined && institutionId != undefined) {
                var questionsId = await getFilteredQuestionsArray(testsId);
                if (questionsId != undefined) {
                    resolve(questionsId);
                }
            }
        }

        if (querie.parameter == "subject") {
            var questionsId = getFilteredDocsArray("subject", querie.value.toLowerCase(), collection(db, "questions"), false);
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

function compareQuestionsFilter(questions) {
    var copyArray = [];
    for (var i = 0; i < questions.length; i++) {
        for (var j = 0; j < questions[i].length; j++) {
            if (copyArray.includes(questions[i][j])) { continue; }
            if (!compareElementsInArray(i, j, questions)) { continue; }
            copyArray[copyArray.length] = questions[i][j]
        }
    }
    if (copyArray.length == 0) { return undefined; }
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

export { getQueries, getFilteredQuestions };