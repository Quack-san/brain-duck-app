import { setTestTimeValue, setPoiterTime } from './testSimulate.js'

function formateTime(testTime) {
	var timeFormate = testTime;
	var hours = Math.floor(timeFormate / (60 * 60));
	timeFormate -= hours * (60 * 60);
	var minutes = Math.floor(timeFormate / 60);
	timeFormate -= minutes * 60;
	var seconds = timeFormate;

	return hours + "h " + minutes + "m " + seconds + "s";
}

function setTestTime(testIsFinished, testTime, pointerTime) {
	if (testIsFinished) { return }
	var nowTime = new Date().getSeconds();
	var diferenceInTime;
	if (nowTime > pointerTime) { diferenceInTime = nowTime - pointerTime }
	else {
		diferenceInTime = (60 - pointerTime) + nowTime;
	}
	setPoiterTime(nowTime);
	setTestTimeValue(testTime - diferenceInTime);

	if (testTime <= 0) {
		setTestTimeValue(0);
		alert("Time's Up!");
		correctTest();
	}
	document.querySelector("#countDown").innerText = formateTime(testTime);
}

export { formateTime, setTestTime }