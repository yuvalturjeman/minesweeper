function getRandomInt(max) {
    return Math.floor(Math.random() * (max)) ;
}

function setTimer(startTime) {
    var elapsedTime = Date.now() - startTime
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = (elapsedTime / 1000).toFixed(3)
}


function startTimer() {
    var startTime = Date.now()
    gTimerInterval = setInterval(setTimer, 1, startTime)
}
