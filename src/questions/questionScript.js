// imports
import { db } from '../firebaseConfigs.js'
import { getDocsArray } from '../general/dataBase.js'
import { collection } from 'firebase/firestore';

var institutions;
var subjects;
var subSubjects;

window.addEventListener("load", async () => {
    institutions = await getDocsArray(collection(db, 'institutions'));
    subjects = await getDocsArray(collection(db, 'subjects'));
    subSubjects = await getDocsArray(collection(db, 'subSubjects'));
});

// request the creation the selection of filter items
document.querySelectorAll(".search-item").forEach((searchItem) => {
    searchItem.addEventListener('click', (event) => {
        var targetID = event.target.getAttribute("id");
        var parentID = event.target.parentElement.getAttribute("id");

        if (targetID == "searchInstitution") { requestItems(institutions, parentID, "institutions"); }
        else if (targetID == "searchSubject") { requestItems(subjects, parentID, "subjects"); }
        else if (targetID == "searchSubSubject") { requestItems(subSubjects, parentID, "subSubjects"); }
    })
})

// create the filter items
function requestItems(itemsArray, parentID, tagType) {
    clearList();
    var idNum = 0;

    if (tagType == "subSubjects") { setSubSubjectsDiv(parentID); setItemsListener(); return; }
    document.querySelector(".search-grid").classList.remove("sg-tcolumn-2");
    document.querySelector(".search-grid").classList.add("sg-tcolumn-4");

    itemsArray.forEach((item) => {
        document.querySelector('.search-grid').appendChild(
            Object.assign(
                document.createElement('div'),
                { id: "item" + idNum },
                { className: "subject-item flex-container centralize" },
                { innerHTML: item.data.content != undefined ? item.data.content : item.data.name },
            )
        );
        var thisItem = document.querySelector("#item" + idNum);
        thisItem.setAttribute("role", "button");
        thisItem.setAttribute("referenceDivID", parentID);
        thisItem.setAttribute("filterId", item.id);
        thisItem.setAttribute("tagtype", tagType);
        idNum++;
    })
    setItemsListener();
}

function setSubSubjectsDiv (parentID) {
    document.querySelector(".search-grid").classList.add("sg-tcolumn-2");
    document.querySelector(".search-grid").classList.remove("sg-tcolumn-4");
    var arrayTags = document.getElementsByClassName("tag");
    var subjectTags = [];
    var subSubjectsArray = [];

    for (var i = 0; i < arrayTags.length; i++) {
        if (arrayTags[i].getAttribute("tagtype") == "subjects") { subjectTags.push(arrayTags[i]); }
    }
    if (subjectTags.length == 0) { alert("Você deve selecionar um assunto antes."); return; }
    for (var i = 0; i < subjectTags.length; i++) {
        var firstMatch = false;
        for (var j = 0; j < subSubjects.length; j++) {
            if (subjectTags[i].firstChild.getAttribute("id") == subSubjects[j].data.subjectId) {
                if (!firstMatch) {
                    subSubjectsArray[subSubjectsArray.length] = 
                    { "subjectId": subjectTags[i].firstChild.getAttribute("id"), "subject": subjectTags[i].firstChild.innerText, "subSubjects": [] };
                    firstMatch = true;
                }
                subSubjectsArray[subSubjectsArray.length-1].subSubjects.push({"content": subSubjects[j].data.content, "id": subSubjects[j].id });
            }
        }
    }

    subSubjectsArray.forEach((tag) => {
        var divSubject = document.createElement("div");
        divSubject.classList.add("subsubject-item");
        var subjectp = document.createElement("p");
        subjectp.appendChild(document.createTextNode(tag.subject));
        divSubject.appendChild(subjectp);

        tag.subSubjects.forEach((subSubject) => {
            var subSubjectDiv = document.createElement('div');
            subSubjectDiv.setAttribute("role", "button");
            subSubjectDiv.setAttribute("filterId", subSubject.id);
            subSubjectDiv.setAttribute("referenceDivID", parentID);
            subSubjectDiv.setAttribute("subjectId", tag.subjectId);
            subSubjectDiv.setAttribute("tagType", "subSubjects");
            subSubjectDiv.appendChild(document.createTextNode(subSubject.content));
            subSubjectDiv.classList.add("subject-item");
            divSubject.appendChild(subSubjectDiv);
        });
        document.querySelector('.search-grid').appendChild(divSubject);
    });

}
// clear the filter items
function clearList() { 
    document.querySelectorAll(".subject-item").forEach((el) => { el.remove(); }); 
    document.querySelectorAll(".subsubject-item").forEach((el) => { el.remove(); });
}

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
    div.setAttribute("tagType", item.getAttribute("tagType"));
    tagValue.classList.add("tag-value");
    tagValue.setAttribute("id", item.getAttribute("filterId"));
    if (item.getAttribute("subjectId") != undefined) { tagValue.setAttribute("subjectId", item.getAttribute("subjectId")); }
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
    var subSubj = document.querySelector("#subSubject");
    var tagValue;
    var query = "";

    if (inst.querySelectorAll(".tag")) {
        for (var i = 0; i < inst.querySelectorAll(".tag").length; i++) {
            tagValue = inst.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query == "" ? query + "institution" + "=" + tagValue.getAttribute("id") : query + "&" + "institution" + "=" + tagValue.getAttribute("id");
        }
    }
    if (subSubj.querySelector(".tag")) {
        for (var i = 0; i < subSubj.querySelectorAll(".tag").length; i++) {
            console.log(subSubj.querySelectorAll(".tag")[i].querySelector(".tag-value"))
            tagValue = subSubj.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query == "" ? query + "subSubject" + "=" + tagValue.getAttribute("id") : query + "&" + "subSubject" + "=" + tagValue.getAttribute("id");
        }
    }

    if (subj.querySelectorAll(".tag")) {
        for (var i = 0; i < subj.querySelectorAll(".tag").length; i++) {
            var skipValue = false;
            subSubj.querySelectorAll(".tag").forEach((subSubjTag) => {
                if (subSubjTag.querySelector(".tag-value").getAttribute("subjectid") == subj.querySelectorAll(".tag")[i].querySelector(".tag-value").getAttribute("id")) {
                    skipValue = true;
                }
            })
            if (!skipValue) {
                tagValue = subj.querySelectorAll(".tag")[i].querySelector(".tag-value");
                query = query == "" ? query + "subject" + "=" + tagValue.getAttribute("id") : query + "&" + "subject" + "=" + tagValue.getAttribute("id");
            }
        }
    }

    if (query == "") {
        window.alert("Você deve selecionar ao menos um filtro");
        return;
    }
    window.location.href = ("filteredQuestions.html?" + query);
})

// general function to set attributes to html elements
function setAttributes(elem, attrs) {
    for (var index in attrs) {
        elem.setAttribute(index, attrs[index]);
    }
}