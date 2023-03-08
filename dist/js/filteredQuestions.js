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

function getQueries () {
    var queries = []
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.getAll("inst")) {
        urlParams.getAll("inst").forEach((tag) => { queries.push({ "parameter": "intitution", "value": tag }); })
    }
    if (urlParams.getAll("subj")) {
        urlParams.getAll("subj").forEach((tag) => { queries.push({ "parameter": "subject", "value": tag }); })
    }
    console.log(queries);
}
getQueries();
