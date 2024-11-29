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
            board[r].push(Square());
        }
    }
    const getBoard = () => board;

    const markSquare = (row ,column, playerMark) => {
            board[row][column].addMark(playerMark)
    }

    const printBoard = () => {
        const boardWithSquareValues = board.map((row) => row.map((square) => square.getValue()))
        console.log(boardWithSquareValues)
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
                    board[r][c] = Square();
                }
            }
        }
    }

    return {
        getBoard,
        printBoard,
        markSquare,
        checkWinner,
        resetBoard
    }
}

function Square() {
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
            console.log('Square already has mark on it. Try again!')
        } else if (row < 3 && row > -1 && column < 3 && column > -1) {
            board.markSquare(row, column, getActivePlayer().mark)
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
const game = GameController('Player One', 'Player Two');


function ScreenController() {
    const game = GameController('Player One', 'Player Two');
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board')

    const board = game.getBoard()

    const updateScreen = () => {
        //clear the board
        boardDiv.textContent = '';
        
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // display player's turn and declare winner when there's a winner
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        if (game.getWinner() !== undefined) {
            playerTurnDiv.textContent = `Player ${game.getWinner()} wins!`
        }
    }

    const joinedSquares = board[0].concat(board[1], board[2]);

    joinedSquares.forEach((square, index) => {
        const squareDiv = document.createElement('div')
        squareDiv.dataset.squareId = index
        console.log(index)
        squareDiv.textContent = square.getValue()
        boardDiv.appendChild(squareDiv)
    })


    function clickHandlerBoard(e) {
        const selectedSquare = e.target.dataset.squareId;

        if (!selectedSquare) return;
    }

    boardDiv.addEventListener('click', clickHandlerBoard)

    return {
    }

}


ScreenController() 