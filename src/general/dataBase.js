import {
	getDocs, doc, query, where, getDoc
} from 'firebase/firestore'


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

async function getSingleDocumentById(db, collectionName, docId) {
	const returnDoc = await getDoc(doc(db, collectionName, docId));
	if (returnDoc.exists()) { return {"data": returnDoc.data(), "id": returnDoc.id}; }
    else { return undefined; }
}

export { getFilteredDocsArray, getSingleDocumentById };