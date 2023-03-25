// firebase configs / imports
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, doc, onSnapshot,
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

// main function of this script
function getDataFromDb() {
    programStatus("Starting process.");
    var institutionsArray = getInstitutions();
    var testsArray = getTests(); 
}

getDataFromDb();

// put the institutions in an array
function getInstitutions() {

    var institutionsArray = [];

    getDocs(collection(db, 'institutions'))
    .then((snapshot) => {
        snapshot.docs.forEach((institution) => {
            institutionsArray.push({"id": institution.id, "name": institution.data().name});
        });
        programStatus("Institutions got.");
        // call the function
        setInstitutions(institutionsArray);
    })
    .catch(err => { 
        programStatus("Error on getInstitutions." + err);
    })
    return institutionsArray;
}

// put the tests in an array
function getTests() {
    var testsArray = [];

    getDocs(collection(db, 'tests'))
    .then((snapshot) => {
        snapshot.docs.forEach((test) => {
            testsArray.push({"id": test.id, 
                "institutionId": test.data().institutionId, "year": test.data().year});
        });
        programStatus("tests got.");
        // call the function
        setTests(testsArray);
    })
    .catch(err =>  {
        programStatus("Error on getTest." + err);
    })
    return testsArray;
}

// set the institutions elements -> btns and divs
function setInstitutions(institutions) {
    var institutionsDivsAlreadyExists = [];
    institutions.forEach( (institution) => {
        var divRoot = document.getElementById("examContainer");
        
        // This five first lines creates a container with the name of the institution inside.
        var btnInstitutionContainer = document.createElement("button");
        btnInstitutionContainer.classList.add(
            "inst-btn",
        );
        setAttributes(btnInstitutionContainer, {
            "institutionId": institution.id 
        })

        var institutionLabel = document.createElement("label");
        institutionLabel.classList.add(
            "inst-label"
        );

        var labelTestText = document.createTextNode(institution.name);
        institutionLabel.appendChild(labelTestText);
        btnInstitutionContainer.appendChild(institutionLabel);


        btnInstitutionContainer.addEventListener("click", showHideTests);
        divRoot.appendChild(btnInstitutionContainer);

        var divboxAllTests = document.createElement("div");
        divboxAllTests.classList.add(
            "inst-exam-list"
        )
        divboxAllTests.setAttribute("id", institution.id);
        divboxAllTests.style.display = "none";
        divRoot.appendChild(divboxAllTests);

        institutionsDivsAlreadyExists.push(institution.id);

        programStatus("Institution setted");
    })
}

// set the tests elements -> btns
function setTests(tests) {
    tests.forEach((test) => {
        var singleTest = document.createElement("button");
        var singleTestLabel = document.createElement("span");
        var singleTestText = document.createTextNode(test.year);

        singleTestLabel.appendChild(singleTestText);
        singleTestLabel.classList.add(
            "border-bottom",
            "border-secondary",
        );
        singleTest.appendChild(singleTestLabel);
        singleTest.classList.add(
            test.institutionId,
            "exam"
        );
        setAttributes(singleTest, {
            "test": test.institutionId,
            "id": test.id,
            "style": "font-size: large"
        });
        singleTest.addEventListener('click', selectTest);
        document.getElementById(test.institutionId).appendChild(singleTest);
        programStatus("Test setted")
    })
}

// show and hide the tests divs
function showHideTests() {
    var divWithAllTest = document.getElementById(this.getAttribute("institutionId"));

        if (divWithAllTest.style.display == "none") {
            divWithAllTest.style.display = "grid";
        } else {
            divWithAllTest.style.display = "none";
        }
    
    document.querySelectorAll("div.testListDiv").forEach( (div) => {
        var divID = div.getAttribute("id");
        if (this.getAttribute("institutionId")!= divID) {
            div.style.display = "none";
        }
    });
}

// general function to set attributes to html elements
function setAttributes(elem, attrs) {
    for(var index in attrs) {
      elem.setAttribute(index, attrs[index]);
    }
}

// send the user to the testSimulate page. Passing the test id as argument
function selectTest() {
    window.location.href = ("testSimulate.html?testId="+this.getAttribute("id"));
}

// general function to print program status
function programStatus(text) {
    console.log(text);
}