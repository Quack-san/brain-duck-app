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

        if (targetID == "searchInstitution") { requestItems(institutions, parentID); }
        else if (targetID == "searchSubject") { requestItems(subjects, parentID); }
        else if (targetID == "searchSubSubject") { requestItems(subSubjects, parentID, true); }
    })
})

// create the filter items
function requestItems(itemsArray, parentID, isSubSubject) {
    clearList();
    var idNum = 0;

    if (isSubSubject) { setSubSubjectsDiv(parentID); setItemsListener(); return; }

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
        idNum++;
    })
    setItemsListener();
}

function setSubSubjectsDiv (parentID) {
    // var array = [];
    // if (document.querySelector("#subject").querySelectorAll(".tag").length == 0) { return; } 
    
   var a = document.getElementById("subject");
   var b = a.getElementsByClassName("tag");
    
    var subjectTags = [];
    if (b.length == 1) { subSubjects = tag.getElementsByClassName("tag-value")}
    else {b.forEach((tag) => { subjectTags.push(tag.getElementsByClassName("tag-value")) }) };
    console.log(subjectTags)
    // if (subjectTags.length == 0) { return; }

    // for (var i = 0; i < subjectTags.length; i++) {
    //     var firstMatch = false;
    //     for (var j = 0; j < subSubjects.length; j++) {
    //         console.log(subjectTags[i])
    //         if (subjectTags[i].getAttribute("id") == subSubjects[i].content.subjectId) {
    //             if (!firstMatch) {
    //                 array[array.length] = { "subjectId": subjectTags[i].getAttribute("id"), "subSubjects": [] };
    //                 firstMatch = true;
    //             }
    //             array[array.length-1].subSubjects.push({"subject": subjectTags[j].innerText, "content": subSubjects.data.content, "id": subSubjects.id });
    //         }
    //     }
    // }

    // array.forEach((tag) => {
    //     var divSubSubject = document.createElement("div");
    //     var subjectp = document.createElement("p");
    //     subjectp.appendChild(document.createTextNode(tag.subject));
    //     divSubSubject.appendChild(subjectp);

    //     tag.subSubjects.forEach((subSubject) => {
    //         var subSubjectDiv = document.createElement('div');
    //         subSubjectDiv.setAttribute("role", "button");
    //         subSubjectDiv.setAttribute("id", "item" + idNum);
    //         subSubjectDiv.setAttribute("filterId", subSubject.id);
    //         thisItem.setAttribute("referenceDivID", parentID);
    //         subSubjectDiv.appendChild(document.createTextNode(subSubject.content));
    //         subSubjectDiv.classList.add("subject-item");
    //         divSubSubject.appendChild(subSubjectDiv);
    //     });
    //     document.querySelector('.search-grid').appendChild(divSubSubject);
    // });

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
    tagValue.setAttribute("id", item.getAttribute("filterId"))
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
        for (var i = 0; i < inst.querySelectorAll(".tag").length; i++) {
            tagValue = inst.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query == "" ? query + "institution" + "=" + tagValue.getAttribute("id") : query + "&" + "institution" + "=" + tagValue.getAttribute("id");
        }
    }
    if (subj.querySelector(".tag")) {
        for (var i = 0; i < subj.querySelectorAll(".tag").length; i++) {
            tagValue = subj.querySelectorAll(".tag")[i].querySelector(".tag-value");
            query = query == "" ? query + "subject" + "=" + tagValue.getAttribute("id") : query + "&" + "subject" + "=" + tagValue.getAttribute("id");
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