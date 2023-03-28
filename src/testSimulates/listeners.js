import { setQuestion, selectAlternative, setAlternativesClasses, 
    setAlternativesContent, setSupplementaryText, getDivStatus } from './DOM.js' 
import { questionsObjArray, questionNumber, numberOfQuestions, isFinished, 
    setNumber, questionAnswers, correctionStatus, alternativesObjArray, supplementaryTextArray,
    setQuestionAnswer } from './testSimulate.js'
import { correctTest } from './testCorrection.js'

function setListeners () {
    // alternatives in html
    document.querySelectorAll(".alternative").forEach((alternative) => {
        alternative.addEventListener('click', (event) => {
            setQuestionAnswer(questionNumber-1,
                selectAlternative(event, isFinished, questionNumber));
        });
    });

    // div questions
    document.querySelectorAll(".questionNumber").forEach((divQuestion) => {
        divQuestion.addEventListener('click', (event) => {
            getDivStatus(questionNumber).classList.remove("activeQuestion");
            setNumber(parseInt(event.target.innerText));
            getDivStatus(questionNumber).classList.add("activeQuestion");
            setQuestion(questionsObjArray[questionNumber - 1].data);
            setAlternativesClasses(isFinished, questionAnswers[questionNumber-1], isFinished?correctionStatus[questionNumber - 1].correctAnswer:undefined);
            setAlternativesContent(alternativesObjArray[questionNumber - 1]);
            setSupplementaryText(questionsObjArray[questionNumber - 1].data.supplementaryTextId, supplementaryTextArray);
        });
    });

    // button to go to next question
    document.getElementById("nextQuestion").addEventListener('click', (event) => {
        if (questionNumber >= numberOfQuestions) { return; }
        getDivStatus(questionNumber).classList.remove("activeQuestion");
        setNumber(questionNumber+1);
        getDivStatus(questionNumber).classList.add("activeQuestion");
        setQuestion(questionsObjArray[questionNumber - 1].data);
        setSupplementaryText(questionsObjArray[questionNumber - 1].data.supplementaryTextId, supplementaryTextArray);
        setAlternativesClasses(isFinished, questionAnswers[questionNumber-1], isFinished?correctionStatus[questionNumber - 1].correctAnswer:undefined);
        setAlternativesContent(alternativesObjArray[questionNumber - 1]);
    });

    // button to go to previous question
    document.getElementById("previousQuestion").addEventListener('click', (event) => {
        if (questionNumber <= 1) { return; }
        getDivStatus(questionNumber).classList.remove("activeQuestion");
        setNumber(questionNumber-1);
        getDivStatus(questionNumber).classList.add("activeQuestion");
        setQuestion(questionsObjArray[questionNumber - 1].data);
        setSupplementaryText(questionsObjArray[questionNumber - 1].data.supplementaryTextId, supplementaryTextArray);
        setAlternativesClasses(isFinished, questionAnswers[questionNumber-1], isFinished?correctionStatus[questionNumber - 1].correctAnswer:undefined);
        setAlternativesContent(alternativesObjArray[questionNumber - 1]);
    });

    // links to check if user wants to end the test
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener('click', (event) => {
            if (isFinished) { return; }
            if (!confirm("Essa ação terminará com a execução do simulado!")) {
                event.preventDefault();
            }
        });
    });

    // supplementaryText
    document.querySelector("#supplementaryTextButton").addEventListener("click", (event) => {
        var supplementaryTextDiv = document.querySelector("#supplementaryText");
        if (supplementaryTextDiv.style.display == "block") { supplementaryTextDiv.style.display = "none"; }
        else { supplementaryTextDiv.style.display = "block"; }
    });

    // end test button
    document.getElementById("endTest").addEventListener('click', correctTest);
}



export { setListeners };

