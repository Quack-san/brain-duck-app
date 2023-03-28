import { setIsFinished, questionAnswers, alternativesObjArray, questionNumber, testTimeInterval, setCorrectionStatus, correctionStatus } from './testSimulate.js'
import { setAlternativesClasses, setDivStatusCorrection } from './DOM.js'

function correctTest() {
	setIsFinished(true);
	var index = 0;
	alternativesObjArray.forEach((alternativeArray) => {
		if (questionAnswers[index] != undefined) {
			if (alternativeArray[questionAnswers[index]].data.isCorrect) {
				setCorrectionStatus(index, { "isCorrect": true, "correctAnswer": getCorrectAlternative(index) });
			}
			else {
				setCorrectionStatus(index, { "isCorrect": false, "correctAnswer": getCorrectAlternative(index) });
			}
		}
		else {
			setCorrectionStatus(index, { "isCorrect": false, "correctAnswer": getCorrectAlternative(index) });
		}
		index++;
	})
	setAlternativesClasses(true, questionAnswers[questionNumber-1], correctionStatus[questionNumber - 1].correctAnswer);
	setDivStatusCorrection(correctionStatus);
	clearInterval(testTimeInterval);
}

function getCorrectAlternative(index) {
	for (var i = 0; i < alternativesObjArray[index].length; i++) {
		if (alternativesObjArray[index][i].data.isCorrect) {
			return i;
		}
	}
}

export { correctTest }