function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    //3x3 2d Array that will represent the game board
    //For this 2d Array, row 0 will represent the top row and
    //column 0 will represent very left column

    for (let r = 0; r < rows; r++) {
        board[r] = [];
       for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }
    const getBoard = () => board;

    const markCell = (row ,column, playerMark) => {
            board[row][column].addMark(playerMark)
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    const checkWinner = () => {
        // check horizontally
        for (let r = 0; r < rows; r++) {
            if (board[r][0].getValue() !== '') {
                if (board[r][0].getValue() === board[r][1].getValue() && board[r][1].getValue() === board[r][2].getValue()) {
                    return board[r][0].getValue()
                }
            }
        }

        // check vertically
        for (let c = 0; c < columns; c++) {
            if (board[0][c].getValue() !== '') {
                if (board[0][c].getValue() === board[1][c].getValue() && board[1][c].getValue() === board[2][c].getValue()) {
                    return board[0][c].getValue()
                }
            }
        }

        // check diagonally
        if (board[0][0].getValue() !== '') {
            if (board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
                return board[0][0].getValue()
            }
        }

        // check anti-diagonally
        if (board[2][0].getValue() !== '') {
            if (board[2][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[0][2].getValue()) {
                return board[2][0].getValue()
            }
        }
    }

    const resetBoard = () => {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c].getValue() !== '') {
                    board[r][c] = Cell();
                }
            }
        }
    }

    return {
        getBoard,
        printBoard,
        markCell,
        checkWinner,
        resetBoard
    }
}

function Cell() {
    let value = '';

    const getValue = () => value;

    const addMark = (mark) => {
        value = mark;
    }

    return {
        getValue,
        addMark
    }
}

function GameController(playerOneName, playerTwoName) {
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            mark: 'o'
        },
        {
            name: playerTwoName,
            mark: 'x'
        }
    ]
    let activePlayer = players[0];
    
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    
    const getActivePlayer = () => activePlayer;
    
    const printNewRound = () => {
        board.printBoard()
        console.log(`It's ${getActivePlayer().name} turn`)
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== '') {
            console.log('Cell already has mark on it. Try again!')
        } else if (row < 3 && row > -1 && column < 3 && column > -1) {
            board.markCell(row, column, getActivePlayer().mark)
            switchPlayer()
        } else {
            console.log('Invalid row and/or column input! Try again')
            return;
        }

        if(board.checkWinner() !== undefined) {
            if (board.checkWinner() === players[0].mark) {
                board.printBoard()
                console.log(`${players[0].name} wins!`)
            } else {
                board.printBoard()
                console.log(`${players[1].name} wins!`)
            }
            board.resetBoard()
            activePlayer = players[0]
            console.log('board reset!')
            printNewRound()
            return;
        }
        printNewRound()
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}


const game = GameController('player1', 'player2');
