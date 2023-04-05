function setUndefinedArray(elementsNumber) {
	var undefinedArray = [];
	for (var i = 0; i < elementsNumber; i++) { undefinedArray[i] = undefined; }
	return undefinedArray;
}

function sortArray(array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < (array.length - i - 1); j++) {
            if(array[j].data.number > array[j+1].data.number) {
                var temporary = array[j]; 
                array[j] = array[j+1]; 
                array[j+1] = temporary; 
            }
        }        
    }
    return array;
}

export { setUndefinedArray, sortArray };