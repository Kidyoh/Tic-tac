import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import backgroundImage from './assets/bgi.png'
import { PlayerCard } from './components/player_card_layout.tsx';
import { calculateWinner } from './components/winner_data.tsx';
function Square({ value, onClick }) {
  return (
    <button className="square w-16 h-16 text-xl font-bold flex justify-center items-center bg-gray-700 border-2 outline-none cursor-pointer" onClick={onClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  playerNames: string[]
  updateLeaderboard: string
  leaderboard: string
}

function Board({ playerNames, updateLeaderboard, leaderboard }:BoardProps) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState(null);

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const newWinner = calculateWinner(nextSquares);
    if (newWinner || isBoardFull(nextSquares)) {
      setWinner(newWinner);
      setShowPopup(true);
      updateLeaderboard(playerNames, newWinner !== null ? newWinner : '');
    }
  }

  function isBoardFull(squares: any[]) {
    return squares.every((square) => square !== null);
  }

  function handleRestart() {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
    setWinner(null);
    setShowPopup(false);
  }

  let status;
  if (!winner) {
    status = `Next player: ${xIsNext ? playerNames.player1 : playerNames.player2}`;
  }
  const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
  const player1Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player1)?.wins || 0;
  const player2Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player2)?.wins || 0;

  return (
    <>

      <div className="flex items-center justify-center h-screen">
        <div className="board">
          <div className="board-row flex">
            {squares.slice(0, 3).map((value, index) => (
              <Square key={index} value={value} onClick={() => handleClick(index)} />
            ))}
          </div>
          <div className="board-row flex">
            {squares.slice(3, 6).map((value, index) => (
              <Square key={index + 3} value={value} onClick={() => handleClick(index + 3)} />
            ))}
          </div>
          <div className="board-row flex">
            {squares.slice(6).map((value, index) => (
              <Square key={index + 6} value={value} onClick={() => handleClick(index + 6)} />
            ))}
          </div>
        </div>
      </div>

      <div className="status w-1/2">
        <div className="p-2 border border-gray-300 rounded">
          {status}
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="w-1/4">
          <PlayerCard
            name={playerNames.player1}
            profilePicture="player1-profile.jpg"
            wins={player1Wins}
          />
        </div>
        <div className="w-1/4"></div> {/* Empty div for spacing */}
        <div className="w-1/4">
          <PlayerCard
            name={playerNames.player2}
            profilePicture="player2-profile.jpg"
            wins={player2Wins}
          />
        </div>
      </div>

      {showPopup && (
        <div className="winner-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 bg-red-700 shadow-md">
          <p className="text-xl mb-2">{winner ? `Congratulations, ${playerName}! You won!` : "It's a draw!"}</p>
          <button className="px-4 py-2 text-base bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700" onClick={handleRestart}>Play Again</button>
        </div>
      )}
    </>
  );
}

function Game() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [playerNames, setPlayerNames] = useState({
    player1: '',
    player2: '',
  });

  function updateLeaderboard(playerNames: { player1: any; player2: any; }, winner: string) {
    const updatedLeaderboard:any[] = [...leaderboard];
    const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
    const existingPlayerIndex = updatedLeaderboard.findIndex((item) => item.name === playerName);
    if (existingPlayerIndex > -1) {
      if (winner) {
        updatedLeaderboard[existingPlayerIndex].wins++;
      }
    } else {
      updatedLeaderboard.push({ name: playerName, wins: winner ? 1 : 0 });
    }
    setLeaderboard(updatedLeaderboard);
  }

  function handlePlayerNameChange(event: React.ChangeEvent<HTMLInputElement>, player: string) {
    const { value } = event.target;
    setPlayerNames((prevPlayerNames) => ({
      ...prevPlayerNames,
      [player]: value,
    }));
  }

  return (
    <div className="bg-[url(backgroundImage)] bg-cover bg-center min-h-screen">
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="game-board mb-4">
        <Board playerNames={playerNames} updateLeaderboard={updateLeaderboard} leaderboard={leaderboard} />
      </div>
      <div className="flex mb-4">
        <div className="w-1/2">
          <div className="p-4 border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Player 1 Name"
              value={playerNames.player1}
              onChange={(event) => handlePlayerNameChange(event, 'player1')}
              className="w-full"
            />
          </div>
        </div>
        <div className="w-1/2">
          <div className="p-4 border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Player 2 Name"
              value={playerNames.player2}
              onChange={(event) => handlePlayerNameChange(event, 'player2')}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="leaderboard w-1/2">
        <div className="p-4 border border-gray-300 rounded">
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((item, index) => (
              <li key={index}>
                {item.name}: {item.wins} win{item.wins !== 1 ? 's' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Game;
