import {
	getDocs, doc, query, where, getDoc, deleteDoc, collection
} from 'firebase/firestore'
import { db } from '../firebaseConfigs.js'


async function getFilteredDocsArray(attribute, value, collection, getId) {
    var q = query(collection, where(attribute, "==", value));
    var docsArray = await getDocs(q)
        .then((snapshot) => {
            var returnDocsArray = [];
            snapshot.docs.forEach((doc) => { 
                returnDocsArray.push((getId==undefined || getId)
                    ?{"data": doc.data(), "id": doc.id}: doc.id); 
            });
            return returnDocsArray;
        }).catch((err) => {
            console.log("Error in getDocs: " + err);
        })
    if (docsArray.length == 0) { docsArray = undefined; }
    return docsArray;
}

async function getDocsArray(collection, getId) {
    var docsArray = await getDocs(collection)
        .then((snapshot) => {
            var returnDocsArray = [];
            snapshot.docs.forEach((doc) => { 
                returnDocsArray.push((getId==undefined || !getId)
                    ?{"data": doc.data(), "id": doc.id}: doc.id); 
            });
            return returnDocsArray;
        }).catch((err) => {
            console.log("Error in getDocs: " + err);
        })
    if (docsArray.length == 0) { docsArray = undefined; }
    return docsArray;
}

async function getSingleDocumentById(db, collectionName, docId) {
	const returnDoc = await getDoc(doc(db, collectionName, docId));
	if (returnDoc.exists()) { return {"data": returnDoc.data(), "id": returnDoc.id}; }
    else { return undefined; }
}

async function deleteDocs(collectionName) {
    var docsToDelete = await getDocsArray(collection(db, collectionName), true);

    docsToDelete.forEach((document) => {
        deleteDoc(doc(db, collectionName, document));
    });
}

export { getFilteredDocsArray, getSingleDocumentById, getDocsArray, deleteDocs };