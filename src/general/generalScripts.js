function setUndefinedArray(elementsNumber) {
	var undefinedArray = [];
	for (var i = 0; i < elementsNumber; i++) { undefinedArray[i] = undefined; }
	return undefinedArray;
}

function sortArray(questions) {
    var arrayCopy = [];
    for (var i = 0; i < questions.length; i++) { arrayCopy[i] = questions[i] }

    for (var i = 0; i < questions.length; i++) {
       for (var j = i; j < questions.length; j++) {
           if (questions[j].data.number < questions[i].data.number) {
                arrayCopy[j] = questions[i]; 
                arrayCopy[i] = questions[j];
           }
       }
       return arrayCopy;
    }
}

export { setUndefinedArray, sortArray };