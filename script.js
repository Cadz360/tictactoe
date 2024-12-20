function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];
    let gameOver = false;

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
        if (gameOver) {
            gameOver = false
            board[row][column].addMark(playerMark)
        } else {
            board[row][column].addMark(playerMark)
        }
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
                    gameOver = true;
                    return board[r][0].getValue()
                }
            }
        }

        // check vertically
        for (let c = 0; c < columns; c++) {
            if (board[0][c].getValue() !== '') {
                if (board[0][c].getValue() === board[1][c].getValue() && board[1][c].getValue() === board[2][c].getValue()) {
                    gameOver = true;
                    return board[0][c].getValue()
                }
            }
        }

        // check diagonally
        if (board[0][0].getValue() !== '') {
            if (board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
                gameOver = true;
                return board[0][0].getValue()
            }
        }

        // check anti-diagonally
        if (board[2][0].getValue() !== '') {
            if (board[2][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[0][2].getValue()) {
                gameOver = true;
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

    const isGameOver = () => gameOver;

    return {
        getBoard,
        printBoard,
        markSquare,
        checkWinner,
        resetBoard,
        isGameOver
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

function GameController() {
    const board = Gameboard();
    let players = [
        {
            name: 'Player One',
            mark: 'o'
        },
        {
            name: 'Player Two',
            mark: 'x'
        }
    ]
    let activePlayer = players[0];
    let winner = '';
    
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    
    const getActivePlayer = () => activePlayer;
    
    const printNewRound = () => {
        board.printBoard()
        console.log(`It's ${getActivePlayer().name} turn`)
    }

    const getWinner = () => winner;

    const changePlayerName = (playerOneOrTwo, name) => {
        if (playerOneOrTwo === 1) {
            players[0].name = name
        } else {
            players[1].name = name
        }
        if (!playerOneOrTwo) return;
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
                winner = players[0].name
                console.log(`${players[0].name} wins!`)
            } else {
                board.printBoard()
                winner = players[1].name
                console.log(`${players[1].name} wins!`)
            }
            board.resetBoard()
            activePlayer = players[0]
            console.log('board reset!')
            printNewRound()
            return;
        }
        printNewRound()
        if (winner === '') {
            console.log('no winner')
        } else {
            winner = ''
            console.log('winner on the loose')
        }
    
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver: board.isGameOver,
        resetBoard: board.resetBoard,
        getWinner,
        changePlayerName
    }
}


function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board')
    const divsContainer = document.querySelector('.container')
    const inputContainerDiv = document.querySelector('.names-input-container')
    const gameContainer = document.querySelector('.game-container')
    const restartBtn = document.querySelector('.restart-btn')
    const nameSubmitBtn = document.getElementById('submit-btn');

    nameSubmitBtn.addEventListener('click', function() {
        game.changePlayerName(1, document.getElementById('player-one-name').value)
        game.changePlayerName(2, document.getElementById('player-two-name').value)
        if (divsContainer.contains(inputContainerDiv)) {
            divsContainer.removeChild(inputContainerDiv) 
            gameContainer.classList.remove('no-display')
            updateScreen()
        }
    })

    restartBtn.addEventListener('click', function() {
        game.resetBoard()
        updateScreen()
    })
    
    const updateScreen = () => {
        //clear the board
        boardDiv.textContent = '';
        
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        
        // display player's turn and declare winner when there's a winner
        if (game.isGameOver()) {
            playerTurnDiv.textContent = `${game.getWinner()} won!`
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        }

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const squareDiv = document.createElement('div')
                squareDiv.dataset.row = `${r}`
                squareDiv.dataset.column = `${c}`
                squareDiv.textContent = board[r][c].getValue()
                boardDiv.appendChild(squareDiv)  
            }
        }
    }
    
    function clickHandlerBoard(e) {
        const selectedSquareRow = e.target.dataset.row
        const selectedSquareColumn = e.target.dataset.column
        console.log(selectedSquareColumn, selectedSquareRow)
        if (!selectedSquareColumn || !selectedSquareRow) return;
        game.playRound(selectedSquareRow, selectedSquareColumn)
        updateScreen()
    }

    boardDiv.addEventListener('click', clickHandlerBoard)

}


ScreenController() 