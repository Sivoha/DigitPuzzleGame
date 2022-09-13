let moves = 0;
let newGamePressed = 0;

generateCells = (cells) => {
    shuffledNumbers = getShuffledNumbers();
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            let newNumber = shuffledNumbers.pop();
            cells[i][j].number.innerHTML = newNumber == 0 ? null : newNumber;
            cells[i][j].value = newNumber == 0 ? null : newNumber;
            cells[i][j].neighbours = [null, null, null, null];
        }
    }
};

getShuffledNumbers = () => {
    numbers = [];

    for (let i = 0; i < 16; ++i) {
        numbers.push(i);
    }
    numbers.sort(() => Math.random() - 0.5);

    return numbers;
};

moveCell = (cells, key) => {
    let keyCodes = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
    let keyCode = keyCodes[key];
    let flag = 0;
    if (keyCode <= 3) {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                getNeighbours(cells, cells[i][j]);
                // console.log(cells[i][j].neighbours);
                if (cells[i][j].neighbours[keyCode] != undefined && flag == 0) {
                    if (
                        cells[i][j].neighbours[keyCode].value === null &&
                        flag == 0
                    ) {
                        updateMoves();
                        let tempNumber = cells[i][j].number.innerHTML;
                        let tempValue = cells[i][j].value;
                        cells[i][j].number.innerHTML =
                            cells[i][j].neighbours[keyCode].number.innerHTML;
                        cells[i][j].value =
                            cells[i][j].neighbours[keyCode].value;
                        cells[i][j].neighbours[keyCode].number.innerHTML =
                            tempNumber;
                        cells[i][j].neighbours[keyCode].value = tempValue;
                        flag = 1;
                    }
                }
            }
        }
    }
    if (isSolvedCheck(cells)) {
        modal.classList.add("open");
        backdrop.classList.add("open");
    }
};

isSolvedCheck = (cells) => {
    cellsCopy = cells.flat();
    let isSolved = 1;
    if (cellsCopy[15].value != null) {
        isSolved = 0;
    } else {
        for (let i = 1; i < 15; ++i) {
            if (cellsCopy[i].value < cellsCopy[i - 1].value) {
                isSolved = 0;
            }
        }
    }
    return isSolved;
};

updateMoves = () => {
    movesCounter.innerHTML = ++moves;
};

resetGame = (cells) => {
    moves = 0;
    movesCounter.innerHTML = 0;
    generateCells(cells);
};

function Cell(cell, number, index) {
    this.cell = cell;
    this.index = index;
    this.number = number;
    this.value = +number.innerHTML;
    this.neighbours = [null, null, null, null];
}

getNeighbours = (cells, cell) => {
    try {
        cell.neighbours[0] =
            cells[Math.floor(cell.index / 4)][(cell.index % 4) - 1];
    } catch {
        cell.neighbours[0] = undefined;
    }
    try {
        cell.neighbours[1] =
            cells[Math.floor(cell.index / 4) - 1][cell.index % 4];
    } catch {
        cell.neighbours[1] = undefined;
    }
    try {
        cell.neighbours[2] =
            cells[Math.floor(cell.index / 4)][(cell.index % 4) + 1];
    } catch {
        cell.neighbours[2] = undefined;
    }
    try {
        cell.neighbours[3] =
            cells[Math.floor(cell.index / 4) + 1][cell.index % 4];
    } catch {
        cell.neighbours[3] = undefined;
    }
};

let backdrop = document.querySelector(".backdrop");
let modal = document.querySelector(".modal");
let documentCells = document.querySelectorAll(".cell");
let documentNumbers = document.querySelectorAll(".number");
let movesCounter = document.querySelector(".moves-count");
let newGameButtons = document.querySelectorAll(".new-game-button");

let cells = [[], [], [], []];
for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
        cells[i].push(
            new Cell(
                documentCells[i * 4 + j],
                documentNumbers[i * 4 + j],
                i * 4 + j
            )
        );
    }
}

closeModal = () => {
    if (modal) {
        modal.classList.remove("open");
    }
    backdrop.classList.remove("open");
};

for (let i = 0; i < newGameButtons.length; ++i) {
    newGameButtons[i].addEventListener("click", (cells) => {
        resetGame(cells);
        closeModal();
    });
}
window.addEventListener("keydown", (event) => moveCell(cells, event.code));
