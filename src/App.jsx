import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square.jsx"

import { TURNS, SCORE } from "./constants.js";

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

  const [score, setScore] = useState(() => {
    const scoreFromStorage = window.localStorage.getItem('score')
    if (scoreFromStorage) return JSON.parse(scoreFromStorage)
    return Array(2).fill(0)
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
    window.localStorage.removeItem('score')
    setScore([0,0])
  }

  const updateBoard = (index) => {

    if(board[index] || winner) return

    const newBoard = [ ...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    const newScore = [...score]
    setScore(newScore)

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    window.localStorage.setItem('score', JSON.stringify(newScore))

    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner){
      confetti()
      setWinner(newWinner)
      if (turn === TURNS.X){
        const meScore = [1, 0]
        setScore(meScore)
      } else {
        const meScore = [0, 1]
        setScore(meScore)
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
        <h2>{score[0]}</h2> || <h2>{score[1]}</h2>
      </section>
      <button onClick={resetScore}>Clear Score</button>
      <WinnerModal resetGame={resetGame} winner={winner}/>
      
    </main>
  )
}

export default App
