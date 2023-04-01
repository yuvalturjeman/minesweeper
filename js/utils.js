function getRandomInt(max) {
    return Math.floor(Math.random() * (max)) ;
}

function startTimer() {
    var startTime = Date.now()
    gTimerInterval = setInterval(setTimer, 1, startTime)

}

function setTimer(startTime) {
    gElapsedTime = Date.now() - startTime
    renderText('.timer span', (gElapsedTime / 1000).toFixed(3))
}

function renderText(elName, value) {
    const elSelector = document.querySelector(elName)
    elSelector.innerText = value
}
