import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square.jsx"

import { TURNS } from "./constants.js";

import { checkWinnerFrom, checkEndGame } from "./logic/board.js";

import { WinnerModal } from "./components/WinnerModal.jsx";

function App() {
  
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [scoreX, setScoreX] = useState(() => {
    const scoreXFromStorage = window.localStorage.getItem('scoreX')
    if (scoreXFromStorage) return JSON.parse(scoreXFromStorage)
    return 0
  })
  const [scoreO, setScoreO] = useState(() => {
    const scoreOFromStorage = window.localStorage.getItem('scoreO')
    if (scoreOFromStorage) return JSON.parse(scoreOFromStorage)
    return 0
  })

  const [winner, setWinner] = useState(null)
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }
  const resetScore = () => {
    window.localStorage.removeItem('scoreX')
    window.localStorage.removeItem('scoreO')
    setScoreX(0)
    setScoreO(0)
  }

  const updateBoard = (index) => {

    if(board[index] || winner) return

    const newBoard = [ ...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    window.localStorage.setItem('scoreX', JSON.stringify(scoreX))
    window.localStorage.setItem('scoreO', JSON.stringify(scoreO))

    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner){
      confetti()
      setWinner(newWinner)
      if (turn === TURNS.X){
        setScoreX(scoreX+1)
        
      } else {
        setScoreO(scoreO+1)
        
      }
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
    
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Game Reset</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>
            )
          }
          )
        }
      </section>
      
      <section className="turn">
                <Square isSelected={turn === TURNS.X}>
                  {TURNS.X}
                </Square>
                <Square isSelected={turn === TURNS.O}>
                  {TURNS.O}
                </Square>
      </section>
      <section className="turn">
        <h2>|-- {scoreX} --|-- {scoreO} --|</h2>

      </section>
      <button onClick={resetScore}>Clear Score</button>
      <WinnerModal resetGame={resetGame} winner={winner}/>
      
    </main>
  )
}

export default App
