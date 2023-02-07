import { initializeApp } from 'firebase/app'
import {
	getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot
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

const db = getFirestore()

const colref = collection(db, 'instituicoes')

// // get data / docs
getDocs(colref)
	.then((snapshot) => {
		let objs = []
		snapshot.docs.forEach((doc) => {
			objs.push({...doc.data, id: doc.id})
		})
		console.log(objs)
	})
	.catch(err => {
		console.log(err.message)
	})

// realtime
// onSnapshot(colref, (snapshot) => {
// 	let objs = []
// 	snapshot.docs.forEach((doc) => {
// 		objs.push({...doc.data, id: doc.id})
// 	})
// })
	

// add
// addDoc(colref, {
// 	propriedade: "aaa",
// })
// .then(() => {
// 	console.log("doc criado")
// })

//delete
// const docref = doc(db, 'lista', "uHj19qjcH73WIC5YWPfW")
// deleteDoc(docref)
// 	.then(() => {
// 		console.log("doc apagado")
// 	})
