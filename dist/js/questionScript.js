var institutions = ["ETEC", "ENEM"];
var subjects = ["Ingreis", "Math"];

document.querySelectorAll(".search-item").forEach( (searchItem) => {
    searchItem.addEventListener('click', (event) => {
        var targetID = event.target.getAttribute("id");
        
        if (targetID == "searchInstitution") { requestItems(institutions) }
        else if (targetID == "searchSubject") { requestItems(subjects) }
        else if (targetID == "searchSubSubject") { clearList() }
    })
})

function requestItems (itemsArray) {
    clearList()

    itemsArray.forEach( (item) => {
        document.querySelector('.search-grid').appendChild(
            Object.assign(
                document.createElement('div'),
                { className : "subject-item flex-container centralize " },
                { role : "button" },
            )
        ).append(
            Object.assign(
                document.createElement('span'),
                { innerHTML : item }
            )
        )
    })
}

function clearList() {
    var root = document.querySelector(".search-grid");
    var toDelete = document.querySelectorAll(".subject-item");
    toDelete.forEach((el) => {
        el.remove();
    })
}