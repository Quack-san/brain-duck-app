const instalacoesArray = [
    {"name": "ETEC", "year": 2020, "id": "etec2020"},
    {"name": "ENEM", "year": 2012, "id": "enem2012"},
    {"name": "ETEC", "year": 2021, "id": "etec2021"},
    {"name": "ETEC", "year": 2022, "id": "etec2022"},
    {"name": "ENEM", "year": 2019, "id": "enem2019"},
    {"name": "FUVEST", "year": 1992, "id": "fuvest1992"},
    {"name": "ENEM", "year": 2061, "id": "enem2061"},
    {"name": "FUVEST", "year": 1990, "id": "fuvest1990"},
    {"name": "HARVARD", "year": 2000, "id": "harvard2000"}
] 

var institutionsDivsAlreadyExists = []

instalacoesArray.forEach( (test) => {
    console.log("Operation Realized: ");
    var divRoot = document.getElementById("examContainer");
    if (!checkExistInstitution(test.name)) {
        // This five first lines creates a container with the name of the institution inside.
        var btnInstitutionContainer = document.createElement("button");
        btnInstitutionContainer.classList.add(
            "testBox",
            "text-center",
            "rounded",
            "btn",
            "shadow",
            );
        setAttributes(btnInstitutionContainer, {
            "style": "background-color: #ff9900"
            })

        var institutionLabel = document.createElement("span");
        institutionLabel.classList.add(
            "testLabel"
            );

        var labelTestText = document.createTextNode(test.name);
        institutionLabel.appendChild(labelTestText);
        btnInstitutionContainer.appendChild(institutionLabel);


        btnInstitutionContainer.addEventListener("click", showHideTests);
        divRoot.appendChild(btnInstitutionContainer);

        var divboxAllTests = document.createElement("div");
        divboxAllTests.classList.add(
            "testListDiv",
            "row"
        )
        divboxAllTests.setAttribute("id", test.name);
        divboxAllTests.style.display = "none";
        divRoot.appendChild(divboxAllTests);

        institutionsDivsAlreadyExists.push(test.name);
    }

    var singleTest = document.createElement("button");
    var singleTestLabel = document.createElement("span");
    var singleTestText = document.createTextNode(test.year);

    singleTestLabel.appendChild(singleTestText);
    singleTestLabel.classList.add(
        "border-bottom",
        "border-secondary",
    )
    singleTest.appendChild(singleTestLabel);
    singleTest.classList.add(
        test.name,
        "test",
        "btn"
        );
    setAttributes(singleTest, {
        "test": test.name,
        "id": test.id,
        "style": "font-size: large"
        });
    singleTest.addEventListener('click', selectTest);
    document.getElementById(test.name).appendChild(singleTest);
})

function checkExistInstitution(institution) {
    let stateReturn = false;
    
    institutionsDivsAlreadyExists.forEach((div) => {
        if (institution == div) { 
            stateReturn = true; 
        } 
    })
    return stateReturn;
}

function showHideTests() {
    var divWithAllTest = document.getElementById(this.innerText);

        if (divWithAllTest.style.display == "none") {
            divWithAllTest.style.display = "block";
        } else {
            divWithAllTest.style.display = "none";
        }
    
    document.querySelectorAll("div.testListDiv").forEach( (div) => {
        var divID = div.getAttribute("id");
        console.log(divID);
        if (this.innerText != divID) {
            div.style.display = "none";
        }
    });
}

function setAttributes(elem, attrs) {
    for(var index in attrs) {
      elem.setAttribute(index, attrs[index]);
    }
}

function selectTest() {
    window.location.href = ("testSimulate.html?idtest="+this.getAttribute("id"));
}