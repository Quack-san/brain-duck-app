// arrays whith tags to filter
var institutions = ["ETEC", "ENEM", "UNESP", "Objetivo", "HAVARD"];
var subjects = ["Ingreis", "Math"];

// request the creation the selection of filter items
document.querySelectorAll(".search-item").forEach((searchItem) => {
    searchItem.addEventListener('click', (event) => {
        var targetID = event.target.getAttribute("id");
        var parentID = event.target.parentElement.getAttribute("id");

        if (targetID == "searchInstitution") { requestItems(institutions, parentID); }
        else if (targetID == "searchSubject") { requestItems(subjects, parentID); }
        else if (targetID == "searchSubSubject") { clearList(); }
    })
})

// create the filter items
function requestItems(itemsArray, parentID) {
    clearList();

    var idNum = 0;
    itemsArray.forEach((item) => {
        document.querySelector('.search-grid').appendChild(
            Object.assign(
                document.createElement('div'),
                { id: "item" + idNum },
                { className : "subject-item flex-container centralize " },
                { innerHTML: item }
            )
        );
        var thisItem = document.querySelector("#item" + idNum);
        thisItem.setAttribute("role", "button");
        thisItem.setAttribute("referenceDivID", parentID);
        idNum++;
    })
    setItemsListener();
}

// clear the filter items
function clearList() { document.querySelectorAll(".subject-item").forEach((el) => { el.remove(); }); }

function setItemsListener() {
    document.querySelectorAll(".subject-item").forEach((item) => {
        item.addEventListener('click', (event) => {
            setTag(event.target);
        })
    })
}

// set the tags selected
function setTag(item) {
    var parent = document.querySelector("#" + item.getAttribute("referenceDivID"));
    if (checksTagAreadyExists(parent, item.innerText)) { return; }
    var div = document.createElement('div');
    var tagValue = document.createElement('p');
    var closeTag = document.createElement('button');

    tagValue.appendChild(document.createTextNode(item.innerText));
    closeTag.appendChild(document.createTextNode("X"));

    div.classList.add("tag");
    tagValue.classList.add("tag-value");
    closeTag.addEventListener('click', (event) => { deleteTag(event.target); })

    div.appendChild(tagValue);
    div.appendChild(closeTag);
    parent.appendChild(div);
}

function checksTagAreadyExists(parent, tagText) {
    var returnStatus = false;
    document.querySelectorAll(".tag").forEach((div) => {
        if (div.querySelector(".tag-value").innerText == tagText) { returnStatus = true; }
    })
    return returnStatus;
}

// delete a tag selected
function deleteTag(tagEl) { tagEl.parentElement.remove(); }

// redirect to the other page
document.querySelector("#searchQuestions").addEventListener("click", () => {
    var inst = document.querySelector("#institution");
    var subj = document.querySelector("#subject");
    var tagValue;
    var query = "";

    if (inst.querySelector(".tag")) {
        for (i = 0; i <  inst.querySelectorAll(".tag").length; i++) {
            tagValue = inst.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query==""? query+"institution"+"="+tagValue.innerText : query+"&"+"institution"+"="+tagValue.innerText;
        }
    }
    if (subj.querySelector(".tag")) {
        for (i = 0; i <  subj.querySelectorAll(".tag").length; i++) {
            tagValue = subj.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query==""? query+"subject"+"="+tagValue.innerText : query+"&"+"subject"+"="+tagValue.innerText;
        }
    }
    if (query == "") {
        window.alert("Você deve selecionar ao menos um filtro");
        return;
    }
   window.location.href = ("filteredQuestions.html?"+query);
})

// general function to set attributes to html elements
function setAttributes(elem, attrs) {
    for (var index in attrs) {
        elem.setAttribute(index, attrs[index]);
    }
}