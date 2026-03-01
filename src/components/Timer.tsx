import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { SkipForward, Flag, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface TimerProps {
  players: Player[];
  timeLimit: number;
  initialState?: { currentPlayerIndex: number; timeLeft: number };
  onStateChange: (state: { currentPlayerIndex: number; timeLeft: number }) => void;
  onEndGame: () => void;
}

export function Timer({ players, timeLimit, initialState, onStateChange, onEndGame }: TimerProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(initialState?.currentPlayerIndex || 0);
  const [timeLeft, setTimeLeft] = useState(initialState?.timeLeft ?? timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    onStateChange({ currentPlayerIndex, timeLeft });
  }, [currentPlayerIndex, timeLeft, onStateChange]);

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
  let bgColorClass = "bg-emerald-500";
  if (percentage < 0.25) {
    colorClass = "text-red-500";
    bgColorClass = "bg-red-500";
  } else if (percentage < 0.5) {
    colorClass = "text-orange-500";
    bgColorClass = "bg-orange-500";
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="text-stone-500 font-medium uppercase tracking-wider text-sm mb-2">目前輪到</div>
        <h2 className="text-3xl font-bold text-stone-900 mb-8">{currentPlayer.name}</h2>
        
        <div className="flex flex-col items-center justify-center mb-8 gap-6">
          <motion.div 
            key={currentPlayerIndex}
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Top Bulb */}
            <div className="w-24 h-24 border-4 border-stone-300 rounded-t-3xl rounded-b-[48px] relative overflow-hidden bg-stone-50 z-10 shadow-inner">
              <div 
                className={`absolute bottom-0 w-full transition-all duration-1000 ease-linear ${bgColorClass}`}
                style={{ height: `${percentage * 100}%` }}
              />
            </div>
            
            {/* Neck */}
            <div className="w-6 h-4 border-l-4 border-r-4 border-stone-300 bg-stone-50 z-20 -my-1" />
            
            {/* Bottom Bulb */}
            <div className="w-24 h-24 border-4 border-stone-300 rounded-b-3xl rounded-t-[48px] relative overflow-hidden bg-stone-50 z-10 shadow-inner flex justify-center">
              {/* Falling Sand Stream */}
              {!isPaused && percentage > 0 && (
                <div className={`absolute top-0 w-1.5 h-full ${bgColorClass} opacity-80 animate-pulse`} />
              )}
              <div 
                className={`absolute bottom-0 w-full transition-all duration-1000 ease-linear ${bgColorClass}`}
                style={{ height: `${(1 - percentage) * 100}%` }}
              />
            </div>
          </motion.div>

          <div className={`text-6xl font-mono font-light tracking-tighter ${colorClass}`}>
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
            結束回合
          </button>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-semibold text-stone-500 uppercase text-xs tracking-wider">下一位</h3>
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
        有人贏了！(結算分數)
      </button>
    </motion.div>
  );
}
