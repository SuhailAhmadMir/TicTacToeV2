import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Users, Play, Gamepad2, Home, BarChart3 } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

interface PlayerNames {
  X: string;
  O: string;
}

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState<PlayerNames>({ X: '', O: '' });
  const [showNameInput, setShowNameInput] = useState(true);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): { winner: Player; line: number[] } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    return { winner: null, line: [] };
  };

  const isDraw = (board: Board): boolean => {
    return board.every(cell => cell !== null) && !checkWinner(board).winner;
  };

  useEffect(() => {
    if (!gameStarted) return;
    
    const { winner: gameWinner, line } = checkWinner(board);
    const draw = isDraw(board);

    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setIsGameActive(false);
      setShowVictoryAnimation(true);
      setGameStats(prev => ({
        ...prev,
        [gameWinner === 'X' ? 'xWins' : 'oWins']: prev[gameWinner === 'X' ? 'xWins' : 'oWins'] + 1
      }));
      
      // Hide animation after 3 seconds
      setTimeout(() => setShowVictoryAnimation(false), 3000);
    } else if (draw) {
      setWinner('draw' as Player);
      setIsGameActive(false);
      setShowVictoryAnimation(true);
      setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      
      // Hide animation after 3 seconds
      setTimeout(() => setShowVictoryAnimation(false), 3000);
    }
  }, [board, gameStarted]);

  const handleCellClick = (index: number) => {
    if (board[index] || !isGameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const startGame = () => {
    if (playerNames.X.trim() && playerNames.O.trim()) {
      setGameStarted(true);
      setShowNameInput(false);
      setIsGameActive(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setIsGameActive(true);
    setShowVictoryAnimation(false);
  };

  const resetStats = () => {
    setGameStats({ xWins: 0, oWins: 0, draws: 0 });
  };

  const newPlayers = () => {
    setShowNameInput(true);
    setGameStarted(false);
    setIsGameActive(false);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setPlayerNames({ X: '', O: '' });
    setShowVictoryAnimation(false);
  };

  const getGameStatus = () => {
    if (winner === 'draw') return "It's a draw!";
    if (winner) return `${playerNames[winner]} wins!`;
    return `${playerNames[currentPlayer]}'s turn`;
  };

  // Victory/Draw Animation Overlay
  const VictoryOverlay = () => {
    if (!showVictoryAnimation) return null;

    const isDraw = winner === 'draw';
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="text-center space-y-6 animate-bounceIn">
          {/* Animated Trophy or Draw Icon */}
          <div className="relative">
            {isDraw ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-2xl opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-full animate-spin-slow">
                  <BarChart3 className="w-16 h-16 text-white" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 rounded-full blur-2xl opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-amber-500 p-8 rounded-full animate-bounce">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                {/* Confetti Effect */}
                <div className="absolute -top-4 -left-4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-6 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-200"></div>
                <div className="absolute -bottom-4 -left-6 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-400"></div>
                <div className="absolute -bottom-2 -right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-600"></div>
                <div className="absolute top-0 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-800"></div>
                <div className="absolute bottom-0 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-1000"></div>
              </div>
            )}
          </div>

          {/* Victory/Draw Message */}
          <div className="space-y-2">
            <h2 className={`text-4xl md:text-6xl font-bold animate-pulse ${
              isDraw 
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent'
            }`}>
              {isDraw ? "It's a Draw!" : "Victory!"}
            </h2>
            {!isDraw && (
              <p className="text-2xl md:text-3xl text-white font-semibold animate-fadeIn animation-delay-500">
                🎉 {playerNames[winner as 'X' | 'O']} Wins! 🎉
              </p>
            )}
          </div>

          {/* Animated Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full animate-float ${
                  ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'][i % 6]
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Name Input Screen
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            {/* Cool Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-2xl border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Gamepad2 className="w-8 h-8 text-blue-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-sm animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse animation-delay-400"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse animation-delay-600"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-sm animate-pulse animation-delay-800"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm animate-pulse animation-delay-1000"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm animate-pulse animation-delay-1200"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse animation-delay-1400"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-sm animate-pulse animation-delay-1600"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Tic Tac Toe
              </h1>
              <p className="text-slate-400 text-lg">Enter player names to begin</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Player X
                  </label>
                  <input
                    type="text"
                    value={playerNames.X}
                    onChange={(e) => setPlayerNames(prev => ({ ...prev, X: e.target.value }))}
                    placeholder="Enter name for X"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                             backdrop-blur-sm"
                    maxLength={15}
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Player O
                  </label>
                  <input
                    type="text"
                    value={playerNames.O}
                    onChange={(e) => setPlayerNames(prev => ({ ...prev, O: e.target.value }))}
                    placeholder="Enter name for O"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                             text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                             focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200
                             backdrop-blur-sm"
                    maxLength={15}
                  />
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={!playerNames.X.trim() || !playerNames.O.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                         disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed
                         text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 
                         border border-blue-500/30 hover:border-blue-400/50 hover:scale-105 active:scale-95
                         flex items-center justify-center gap-3 shadow-lg disabled:hover:scale-100"
              >
                <Play className="w-5 h-5" />
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <>
      <VictoryOverlay />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto space-y-4">
          {/* Compact Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg blur-md opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-2 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-sm animate-pulse ${
                          ['bg-blue-400', 'bg-purple-400', 'bg-cyan-400'][i % 3]
                        }`} style={{ animationDelay: `${i * 200}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Tic Tac Toe
              </h1>
            </div>
            
            {/* Compact Game Status */}
            <div className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${
              winner === 'draw' 
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' 
                : winner 
                  ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                  : currentPlayer === 'X'
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                    : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
            }`}>
              {getGameStatus()}
            </div>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-center">
              <div className="text-blue-400 font-bold text-lg">{gameStats.xWins}</div>
              <div className="text-slate-400 text-xs truncate">{playerNames.X}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-center">
              <div className="text-amber-400 font-bold text-lg">{gameStats.draws}</div>
              <div className="text-slate-400 text-xs">Draws</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-center">
              <div className="text-cyan-400 font-bold text-lg">{gameStats.oWins}</div>
              <div className="text-slate-400 text-xs truncate">{playerNames.O}</div>
            </div>
          </div>

          {/* Game Board */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl">
            <div className="grid grid-cols-3 gap-2 aspect-square">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={!isGameActive || cell !== null}
                  className={`
                    aspect-square rounded-lg font-bold text-2xl transition-all duration-200 
                    border-2 border-slate-600/50 backdrop-blur-sm
                    ${cell === null && isGameActive 
                      ? 'hover:bg-slate-700/50 hover:border-slate-500 hover:scale-105 cursor-pointer' 
                      : 'cursor-not-allowed'
                    }
                    ${winningLine.includes(index) 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 animate-pulse' 
                      : 'bg-slate-700/20'
                    }
                    ${cell === 'X' ? 'text-blue-400' : cell === 'O' ? 'text-cyan-400' : 'text-slate-400'}
                    active:scale-95
                  `}
                >
                  {cell && (
                    <span className={`inline-block transition-all duration-300 ${
                      winningLine.includes(index) ? 'animate-bounce' : ''
                    }`}>
                      {cell}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Icon Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={resetGame}
              title="New Game"
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 
                       text-white p-3 rounded-xl transition-all duration-200 
                       border border-slate-500/30 hover:border-slate-400/50 hover:scale-110 active:scale-95
                       shadow-lg group"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            <button
              onClick={resetStats}
              title="Reset Stats"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 
                       text-white p-3 rounded-xl transition-all duration-200 
                       border border-red-500/30 hover:border-red-400/50 hover:scale-110 active:scale-95
                       shadow-lg group"
            >
              <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            
            <button
              onClick={newPlayers}
              title="New Players"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 
                       text-white p-3 rounded-xl transition-all duration-200 
                       border border-purple-500/30 hover:border-purple-400/50 hover:scale-110 active:scale-95
                       shadow-lg group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;