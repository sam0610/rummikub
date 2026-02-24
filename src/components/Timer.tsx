import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { SkipForward, Flag, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface TimerProps {
  players: Player[];
  timeLimit: number;
  onEndGame: () => void;
}

export function Timer({ players, timeLimit, onEndGame }: TimerProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setTimeLeft(timeLimit);
    setIsPaused(false);
  };

  const percentage = timeLeft / timeLimit;
  let colorClass = "text-emerald-500";
  if (percentage < 0.25) colorClass = "text-red-500";
  else if (percentage < 0.5) colorClass = "text-orange-500";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="text-stone-500 font-medium uppercase tracking-wider text-sm mb-2">Current Turn</div>
        <h2 className="text-3xl font-bold text-stone-900 mb-8">{currentPlayer.name}</h2>
        
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="#f5f5f4"
              strokeWidth="12"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - percentage)}
              className={`transition-all duration-1000 ease-linear ${colorClass}`}
              strokeLinecap="round"
            />
          </svg>
          <div className={`text-7xl font-mono font-light tracking-tighter ${colorClass}`}>
            {timeLeft}
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          <button
            onClick={nextTurn}
            className="flex-[3] bg-stone-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <SkipForward size={24} />
            End Turn
          </button>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-semibold text-stone-500 uppercase text-xs tracking-wider">Up Next</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x">
          {players.map((p, i) => {
            if (i === currentPlayerIndex) return null;
            return (
              <div key={p.id} className="snap-start shrink-0 bg-white border border-stone-200 rounded-xl px-4 py-3 flex items-center gap-3 w-48">
                <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="font-medium truncate">{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onEndGame}
        className="mt-8 w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
      >
        <Flag size={24} />
        Someone Won! (End Game)
      </button>
    </motion.div>
  );
}
