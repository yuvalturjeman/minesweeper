'use strict'

const CLICKED_MINE = '💥'
const MINE = '💣'
const FLAG = '🚩'
var gElModal = document.querySelector('.modal')
var gSize = 4
var gNumOfMines = 2
var gLivesCount 
var isFirstClick
var gTimerInterval
var gBoard 

function onInit() {
    isFirstClick = true;
    gLivesCount = 3 
    var elLives = document.querySelector('.lives-left span')
    elLives.innerText = gLivesCount
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
                isMarked: false
            }
        }
    }
    console.log(board);
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
            <td class="${className}"  data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="event.preventDefault(); cellMarked(this);return false;">
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
    gLivesCount = 3
    isFirstClick = true
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
           
            // console.log(board[randRow][randCol].isMine);
            minesCount++;
        }
    }
}

function onCellClicked(elCell, row, col) {
    
    console.log(elCell, row, col);
    var cell = gBoard[row][col]
    handleFirstClick()

    if (cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('shown')

    if (cell.isMine)  gameOver()
     else {
        var minesCount = countMinesArround(row, col);
        if (minesCount === 0) {
            revealNeighbors(row, col);
            elCell.innerHTML = '0'
        } else {
            elCell.innerHTML = minesCount;
        }
        checkVictory()
    }
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
    victory()
}

function revealMines() {
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                var elCell = document.querySelectorAll('td.mine');
                elCell.forEach(function (cell) {
                    cell.innerText = MINE
                    cell.isShown = true;
                });
            }
        }
    }
}

function cellMarked(elCell) {
    elCell.classList.toggle('marked');
    var elCellClass = elCell.classList
    elCell.textContent = elCellClass.contains('marked') ? FLAG : ''
    return false;
}

function handleFirstClick() {
    if (isFirstClick) {
        
        startTimer();
        isFirstClick = false;
        addMines(gBoard, gNumOfMines)
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
    elCell.innerHTML = (minesCount > 0) ? minesCount : 0;
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

function victory() {
    var elvictory = document.querySelector('h2 span')
    elvictory.innerText = 'Victory!!!'
    onEndOfGame()
    
    
}

function gameOver() {
    gLivesCount--
    var elLives = document.querySelector('h2 span')
    elLives.innerText = gLivesCount
    if(gLivesCount<=0){
        elLives.innerText = 'You Lost!'
    onEndOfGame()
    
    
}
}

function onEndOfGame() {
    disableBoard()
    revealMines();
    clearInterval(gTimerInterval)
}

function disableBoard() {
    var elBoard = document.querySelector('.board')
    elBoard.classList.add('disabled')
}

function isOutOfRange(row, col) {
    return (row < 0 || row >= gSize || col < 0 || col >= gSize);
  }

