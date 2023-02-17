const instalacoesArray = [
    {"name": "ETEC", "year": 2020, "id": "abc"},
    {"name": "ENEM", "year": 2012, "id": "abc"},
    {"name": "ETEC", "year": 2021, "id": "abc"},
    {"name": "ETEC", "year": 2022, "id": "abc"},
    {"name": "ENEM", "year": 2019, "id": "abc"},
    {"name": "FUVEST", "year": 1992, "id": "abc"},
    {"name": "ENEM", "year": 2061, "id": "abc"},
    {"name": "FUVEST", "year": 1990, "id": "abc"},
    {"name": "HAVARD", "year": 2000, "id": "abc"}
] 

var institutionsDivsAlreadyExists = []

instalacoesArray.forEach( (test) => {
    console.log("array function initialized");
    var divRoot = document.getElementById("examContainer");
    if (!checkExistInstitution(test.name)) {
        console.log("inside if condition");
        // This five first lines creates a container with the name of the institution inside.
        var newLabelContainer = document.createElement("div");
        newLabelContainer.classList.add(
            "testBox", 
            "bg-info", 
            "m-2", 
            "text-center",
            "rounded"
            );
        setAttributes(newLabelContainer, {
            "role": "button"
        })
        console.log("after set attributes function");

        var newLabelTest = document.createElement("span");
        newLabelTest.classList.add("testLabel");

        var labelTestText = document.createTextNode(test.name);
        newLabelTest.appendChild(labelTestText);
        newLabelContainer.appendChild(newLabelTest);


        newLabelContainer.addEventListener("click", showHideTests);
        divRoot.appendChild(newLabelContainer);

        var newDivTest = document.createElement("div");
        newDivTest.setAttribute("id", test.name);
        divRoot.appendChild(newDivTest);

        institutionsDivsAlreadyExists.push(test.name);
    }

    var newTest = document.createElement("button");
    var newTestText = document.createTextNode(test.year);
    newTest.appendChild(newTestText);
    newTest.classList.add(test.name, "test");
    newTest.setAttribute("test", test.name);
    newTest.setAttribute("id", test.id)
    newTest.style.display = "none";
    newTest.addEventListener('click', selectTest);
    document.getElementById(test.name).appendChild(newTest);
})

function checkExistInstitution(institution) {
    console.log("check function executed");
    let stateReturn = false;
    
    institutionsDivsAlreadyExists.forEach((div) => {
        if (institution == div) { 
            stateReturn = true; 
        } 
    })
    return stateReturn;
}

function showHideTests() {
    console.log("colapse function executed");
    var testClicked = this.innerText;
    document.querySelectorAll(".test").forEach((test) => {
         var testName = test.getAttribute("test");

        if (testName == testClicked) {
            if (test.style.display == "none") {
            test.style.display = "block";
            } else {
                test.style.display = "none";
            }
        }
    })
}

function setAttributes(el, attrs) {
    for(var index in attrs) {
      el.setAttribute(index, attrs[index]);
    }
}

function selectTest() {
    window.location.href = ("testSimulate.html?idtest="+this.getAttribute("id"));
}