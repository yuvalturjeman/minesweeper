'use strict'

const CLICKED_MINE = '💥'
const MINE = '💣'
const FLAG = '🚩'

var gGame
var gSize
var gNumOfMines


var gTimerInterval
var gBoard

function onInit() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPass: 0,
        IsVictory: false,
        isFirstClick: true,
        livesCount: 3,
    }
   
    gSize = 4
    gNumOfMines = 2
    renderText('.reset-btn', '😁')
    renderText('h2 span', gGame.livesCount)
    clearInterval(gTimerInterval)
    gBoard = buildBoard(gSize)

    renderBoard(gSize)

    var elBoard = document.querySelector('.board')
    elBoard.classList.remove('disabled')
}

function buildBoard(size) {

    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,

            }
        }
    }
//     console.log(board);
    return board
}

function renderBoard(size) {
    var strHTML = ''
    strHTML += '<table>'
    for (var i = 0; i < size; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < size; j++) {
            const cell = gBoard[i][j]
            var className = cell.isMine ? 'mine' : 'empty';

            strHTML += `
            <td class="${className}"  data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="event.preventDefault(); cellMarked(this,  ${i}, ${j});return false;">
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>'


    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function setGameLevel(size, numOfMines) {
    clearInterval(gTimerInterval)
    gGame.livesCount = 3
    renderText('.reset-btn', '😁')
    renderText('h2 span', gGame.livesCount)
    gGame.isFirstClick = true
    var elBoard = document.querySelector('.board')
    elBoard.classList.remove('disabled')
    gSize = size;
    gNumOfMines = numOfMines
    gBoard = buildBoard(size);

    renderBoard(size);
}

function addMines(board, numOfMines) {
    var minesCount = 0;
    while (minesCount < numOfMines) {
        var randRow = getRandomInt(gSize - 1);
        var randCol = getRandomInt(gSize - 1);

        if (!board[randRow][randCol].isMine) {
            board[randRow][randCol].isMine = true;
            minesCount++;
        }
    }
}

function onCellClicked(elCell, row, col) {
//     console.log(elCell, row, col);
    handleFirstClick(row, col)

//     console.log(gBoard);

    var cell = gBoard[row][col]



    if (cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('shown')

    if (cell.isMine) gameOver()
    else {
        var minesCount = countMinesArround(row, col);
        elCell.innerText = minesCount;
        if (minesCount === 0) {
            revealNeighbors(row, col);
        } else {
            cell.minesAroundCount = minesCount
        }
    }
    checkVictory()

}

function checkVictory() {
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                return false;
            }
        }
    }
    
    onVictory()
}

function revealMines() {
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                var elCell = document.querySelectorAll('td.mine');
                elCell.forEach(function (cell) {
                    cell.innerText = gGame.isVictory ? FLAG : MINE
                    cell.isShown = true;
                });
            }
        }
    }
}



function cellMarked(elCell, row, col) {
    var cell = gBoard[row][col]
    if (cell.isShown && !cell.isMine) return
    elCell.classList.toggle('marked');
//     console.log('elCell', elCell);
    var elCellClass = elCell.classList
//     console.log('elCellClass', elCellClass);
    if (elCellClass.contains('marked')) {
        elCell.textContent = FLAG
        cell.isMarked = true
        gGame.markedCount++
//         console.log('gGame.markedCount', gGame.markedCount);
    } else {
        elCell.textContent = ''
        cell.isMarked = false
        gGame.markedCount--
//         console.log('gGame.markedCount', gGame.markedCount);
    }

}

function handleFirstClick(row, col) {
    if (gGame.isFirstClick) {

        addMines(gBoard, gNumOfMines)
        renderBoard(gSize);
        revealCell(row, col)
        startTimer();
        gGame.isFirstClick = false;


    }
}

function revealNeighbors(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue;
            if (isOutOfRange(i, j)) continue;
            revealCell(i, j);
        }
    }
}

function revealCell(row, col) {
    var cell = gBoard[row][col];
    if (cell.isMine || cell.isShown) return;
    cell.isShown = true;
    var elCell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
    elCell.classList.add('shown');
    var minesCount = countMinesArround(row, col);

    elCell.innerText = minesCount
    if (minesCount === 0) revealNeighbors(row, col);
}

function countMinesArround(row, col) {
    var minesCount = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue;
            if (isOutOfRange(i, j)) continue;
            if (gBoard[i][j].isMine) minesCount++;
        }
    }
    return minesCount;
}

function onVictory() {
    gGame.isVictory = true
    renderText('.reset-btn', '😎')
    onEndOfGame()
}
// when the user lose
function gameOver() {
    gGame.livesCount--
    renderText('h2 span', gGame.livesCount)
    if (gGame.livesCount <= 0) {
        renderText('.reset-btn', '☹️')
        onEndOfGame()
    }
}

// msg, mines, timer
function onEndOfGame() {
    var msg = gGame.isVictory ? 'You Won!!!' : 'You Lost'
    onOpenModal(msg)
    disableBoard()
    revealMines();
    clearInterval(gTimerInterval)
}

function onOpenModal(msg) {
    const elModal = document.querySelector('.modal')
    const elH3 = elModal.querySelector('h3')
    elH3.innerText = msg
    elModal.style.display = 'block'
    setTimeout(onCloseModal, 3000)

}
// to close the msg after 3 sec
function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

// to block the table on the end of the game 
function disableBoard() {
    var elBoard = document.querySelector('.board')
    elBoard.classList.add('disabled')
}

function isOutOfRange(row, col) {
    return (row < 0 || row >= gSize || col < 0 || col >= gSize);
}

function renderText(elName, value) {
    const elSelector = document.querySelector(elName)// '.cell-2-7'
    elSelector.innerText = value
}

