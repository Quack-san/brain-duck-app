var institutions = ["ETEC", "ENEM"];
var subjects = ["Ingreis", "Math"];

document.querySelectorAll(".search-item").forEach((searchItem) => {
    searchItem.addEventListener('click', (event) => {
        var targetID = event.target.getAttribute("id");
        var parentID = event.target.parentElement.getAttribute("id");

        if (targetID == "searchInstitution") { requestItems(institutions, parentID); }
        else if (targetID == "searchSubject") { requestItems(subjects, parentID); }
        else if (targetID == "searchSubSubject") { clearList(); }
    })
})

function requestItems(itemsArray, parentID) {
    clearList();

    var idNum = 0;
    itemsArray.forEach((item) => {
        document.querySelector('.search-grid').appendChild(
            Object.assign(
                document.createElement('div'),
                { id: "item" + idNum },
                { className: "subject-item" },
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

function clearList() { document.querySelectorAll(".subject-item").forEach((el) => { el.remove(); }); }

function setItemsListener() {
    document.querySelectorAll(".subject-item").forEach((item) => {
        item.addEventListener('click', (event) => {
            setTag(event.target);
        })
    })
}

function setTag(item) {
    var parent = document.querySelector("#" + item.getAttribute("referenceDivID"));
    if (checksTagAreadyExists(parent, item.innerText)) { return; }
    parent.appendChild(
        Object.assign(
            document.createElement('div'),
            { className: "tag" },
            { innerHTML: item.innerText }
        )
    )
}
function checksTagAreadyExists(parent, tagText) {
    var returnStatus = false;
    document.querySelectorAll(".tag").forEach((tag) => {
        if (tag.innerText == tagText) { returnStatus = true; }
    })
    return returnStatus;
}


// general function to set attributes to html elements
function setAttributes(elem, attrs) {
    for (var index in attrs) {
        elem.setAttribute(index, attrs[index]);
    }
}