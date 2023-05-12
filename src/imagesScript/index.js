// firebase configs / imports
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

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
const storage = getStorage();

document.querySelector("#upload").addEventListener("click", uploadImage);

function uploadImage() {
    const file = document.querySelector("#photo").files[0];
    const reference = ref(storage, "images/" + file.name);
    const metadata = {
        contentType: file.type
    };
    const task = uploadBytesResumable(reference, file, metadata);

    task.on("state-changed", () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
        })
    })

}

getDownloadURL(ref(storage, 'images/pato.jpg'))
    .then((url) => {
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
    }).catch((error) => {
        // Handle any errors
    })
