import {Square} from "./Square.jsx" 

export function WinnerModal({winner, resetGame}) {
    if (winner === null) return null

    const winnerText = winner === false ? 'Deus' : 'Winner'
    const winText = winner === false ? null : winner && <Square>{winner}</Square>
    const winMessage = winner === false ? 'Sorry :(' : 'Congratulations!!!'

    return (
              <section className="winner">
                <div className="text">
                  <h2>
                    {winnerText}
                  </h2>
                  <header className="win">
                    {winText}
                  </header>
                  <h2>
                    {winMessage}
                  </h2>
                  <footer>
                    <button onClick={resetGame}>Play Again</button>
                  </footer>
                </div>
              </section>
            )
}