const instalacoesArray = [
    {"name": "ETEC", "year": 2020},
    {"name": "ETEC", "year": 2021},
    {"name": "ETEC", "year": 2022}
] 

var institutionsDivsAlreadyExists = []

instalacoesArray.forEach( (test ) => {
    var divRoot = document.getElementById("examContainer");
    if (!checkExistInstitution(test.name)) {
        // This five first lines creates a container with the name of the institution inside.
        var newLabelContainer = document.createElement("div");
        var newLabelTest = document.createElement("span");
        newLabelContainer.appendChild(newLabelTest);
        var labelTestText = document.createTextNode(test.name);
        newLabelTest.appendChild(labelTestText);

        newLabelContainer.addEventListener("click", showHideTests);
    }
})

instalacoesArray.forEach( (test) => {
    var divRoot = document.getElementById("examContainer");
    if (!checkExistInstitution(test.name)) {
        var newLabelTest = document.createElement("button");
        var labelTestText = document.createTextNode(test.name);
        newLabelTest.appendChild(labelTestText);
        newLabelTest.addEventListener("click", showHideTests);
        divRoot.appendChild(newLabelTest);       

        var newDivTest = document.createElement("div");
        newDivTest.setAttribute("id", test.name);
        divRoot.appendChild(newDivTest);

        institutionsDivsAlreadyExists.push(test.name);
    } 

    var newTest = document.createElement("button");
    var newTestText = document.createTextNode(test.year);
    newTest.appendChild(newTestText);
    newTest.classList.add(test.name, "test");
    newTest.setAttribute("test", test.name)
    newTest.style.display = "none";
    divRoot.appendChild(newTest);
})

function checkExistInstitution(institution) {
    let stateReturn = false;
    
    institutionsDivsAlreadyExists.forEach((div) => {
        if (institution == div) { 
            console.log("return true")
            stateReturn = true; 
        } 
    })
    return stateReturn;
}

function showHideTests() {
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