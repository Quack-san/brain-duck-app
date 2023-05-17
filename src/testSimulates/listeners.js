import { setQuestion, selectAlternative, setAlternativesClasses, 
    setAlternativesContent, setSupplementaryText, getDivStatus, setQuestionImage } from './DOM.js' 
import { questionsObjArray, questionNumber, numberOfQuestions, isFinished, 
    setNumber, questionAnswers, correctionStatus, alternativesObjArray, supplementaryTextArray,
    setQuestionAnswer } from './testSimulate.js'
import { correctTest } from './testCorrection.js'
var hasTime = true;

function setListeners () {
    // alternatives in html
    document.querySelectorAll(".alternative").forEach((alternative) => {
        alternative.parentElement.addEventListener('click', (event) => {
            setQuestionAnswer(questionNumber-1,
                selectAlternative(event, isFinished, questionNumber));
        });
    });

    document.querySelector("#noTime").addEventListener('click', (event) => {
        //hasTime = false;
        console.log("hasTime")
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
            setQuestionImage(questionsObjArray[questionNumber - 1].data.imageURL);
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
        setQuestionImage(questionsObjArray[questionNumber - 1].data.imageURL);
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
        setQuestionImage(questionsObjArray[questionNumber - 1].data.imageURL);
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

    // question images
    document.querySelector("#questionImageButton").addEventListener("click", (event) => {
        var questionImage = document.querySelector("#questionImage");
        if (questionImage.style.display == "block") { questionImage.style.display = "none"; }
        else { questionImage.style.display = "block"; }
    });

    // end test button
    document.getElementById("endTest").addEventListener('click', correctTest);
}



export { setListeners, hasTime };

