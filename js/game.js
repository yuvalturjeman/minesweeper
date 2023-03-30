'use strict'

const MINE = '🚩'
var gSize = 4
var gNumOfMines = 2
var gBoard = buildBoard(gSize)

function onInit() {

    addMines(gBoard, gNumOfMines)
    renderBoard(gSize)
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
            <td class="${className}"  data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)">
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>'

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function countMinesArround(row, col) {
    var minesCount = 0;
    for (var i = row - 1; i <= row + 1; i++) {

        for (var j = col - 1; j <= col + 1; j++) {
            if (i < 0 || i >= gSize || j < 0 || j >= gSize || (i === row && j === col)) continue
            if (gBoard[i][j].isMine) minesCount++;

        }
    }
    return minesCount
}



function addMines(board, numOfMines) {
    var minesCount = 0;
    while (minesCount < numOfMines) {
        var randRow = getRandomInt(0, gSize);
        var randCol = getRandomInt(0, gSize);

        if (!gBoard[randRow][randCol].isMine) {
            var minePos = board[randRow][randCol]
            minePos.isMine = true
            console.log(board[randRow][randCol].isMine);
            minePos.className = 'mine'
            minesCount++;
        }
    }
}


function setGameLevel(size, numOfMines) {
    gSize = size;
    gNumOfMines = numOfMines
    gBoard = buildBoard(gSize);
    addMines(gBoard, numOfMines)
    renderBoard(gSize);
}






function onCellClicked(elCell, row, col) {
    var cell = gBoard[row][col]

    if (cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('shown')


    if (cell.isMine) {
        revealMines();
        elCell.innerText = MINE;
        alert('You lost')

    } else {
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
    
    alert('You won!');
    revealMines()
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





function revealNeighbors(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i < 0 || i >= gSize || j < 0 || j >= gSize || (i === row && j === col)) continue;
            var cell = gBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                cell.isShown = true;
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.classList.add('shown');
                var minesCount = countMinesArround(i, j);
                if (minesCount > 0) {
                    elCell.innerHTML = minesCount;
                }
                else {
                    elCell.innerHTML = 0
                    revealNeighbors(i, j);
                }
            }
        }
    }
}

function cellMarked(elCell) {
    elCell.classList.toggle('marked');
    elCell.childNodes[0].nodeValue = elCell.classList.contains('marked') ? '🚩' : '';
    return false;
  }