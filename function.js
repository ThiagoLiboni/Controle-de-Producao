

let timerInterval;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

export function time(){
    return {seconds,minutes}
}

export function startTimer() {
   
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    milliseconds++;
    if (milliseconds > 10) {
        milliseconds = 0
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
    }
    document.getElementById('timer').innerText = formatTime(minutes) + ":" + formatTime(seconds);
}
function formatTime(time) {
    return (time < 10 ? "0" + time : time);
}

export function stopTimer() {
    clearInterval(timerInterval);
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    document.getElementById('timer').innerText = "00:00";

}

export function resetTimer() {
    clearInterval(timerInterval);
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    document.getElementById('timer').innerText = "00:00";
    setTimeout(startTimer,500);
    setTimeout(()=>{
    document.getElementById('info').innerText = ""},2000)
}
