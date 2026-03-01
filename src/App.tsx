import React, { useState, useEffect } from 'react';
import { Setup } from './components/Setup';
import { Timer } from './components/Timer';
import { Scoring } from './components/Scoring';
import { Results } from './components/Results';
import { Player } from './types';

export type GameState = 'setup' | 'playing' | 'scoring' | 'results';

const STORAGE_KEY = 'rummikub_timer_state';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).gameState || 'setup';
      } catch (e) {
        return 'setup';
      }
    }
    return 'setup';
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).players || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [timeLimit, setTimeLimit] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).timeLimit || 60;
      } catch (e) {
        return 60;
      }
    }
    return 60;
  });

  const [timerState, setTimerState] = useState<{ currentPlayerIndex: number; timeLeft: number } | undefined>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).timerState;
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gameState,
      players,
      timeLimit,
      timerState
    }));
  }, [gameState, players, timeLimit, timerState]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-orange-200">
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-orange-600 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rummikub Companion
        </h1>
      </header>
      
      <main className="max-w-md mx-auto p-4 sm:p-6">
        {gameState === 'setup' && (
          <Setup 
            initialPlayers={players.length > 0 ? players : undefined}
            initialTimeLimit={timeLimit}
            onStart={(p, t) => { setPlayers(p); setTimeLimit(t); setGameState('playing'); }} 
          />
        )}
        {gameState === 'playing' && (
          <Timer 
            players={players} 
            timeLimit={timeLimit} 
            initialState={timerState}
            onStateChange={setTimerState}
            onEndGame={() => {
              setTimerState(undefined);
              setGameState('scoring');
            }} 
          />
        )}
        {gameState === 'scoring' && (
          <Scoring 
            players={players} 
            setPlayers={setPlayers} 
            onFinish={() => {
              const totalPenalty = players.reduce((sum, p) => sum + (p.isWinner ? 0 : (p.penaltyScore || 0)), 0);
              setPlayers(players.map(p => {
                const roundScore = p.isWinner ? totalPenalty : -(p.penaltyScore || 0);
                return { ...p, totalScore: p.totalScore + roundScore };
              }));
              setGameState('results');
            }} 
          />
        )}
        {gameState === 'results' && (
          <Results 
            players={players} 
            onNewGame={() => {
              setPlayers(players.map(p => ({ ...p, penaltyScore: null, scoreBreakdown: undefined, isWinner: false })));
              setGameState('playing');
            }}
            onReset={() => setGameState('setup')}
          />
        )}
      </main>
    </div>
  );
}
