import { setIsFinished, questionAnswers, questionNumber, testTimeInterval, setCorrectionStatus, correctionStatus, questionsObjArray, isFinished } from './testSimulate.js'
import { setAlternativesClasses, setDivStatusCorrection } from './DOM.js'

function correctTest() {
	if (isFinished) { return; }
	setIsFinished(true);
	for (var i = 0; i < questionsObjArray.length; i++) {
		if (questionAnswers[i] != undefined) {
			if (questionAnswers[i] == questionsObjArray[i].data.correctAlternative) {
				setCorrectionStatus(i, { "isCorrect": true, "correctAnswer": getCorrectAlternative(i) });
			}
			else {
				setCorrectionStatus(i, { "isCorrect": false, "correctAnswer": getCorrectAlternative(i) });
			}
		}
		else {
			setCorrectionStatus(i, { "isCorrect": false, "correctAnswer": getCorrectAlternative(i) });
		}
	}
	setAlternativesClasses(true, questionAnswers[questionNumber-1], correctionStatus[questionNumber - 1].correctAnswer);
	setDivStatusCorrection(correctionStatus);
	clearInterval(testTimeInterval);
}

function getCorrectAlternative(index) {
	return questionsObjArray[index].data.correctAlternative;
}

export { correctTest }