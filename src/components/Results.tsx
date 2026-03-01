import React from 'react';
import { Player } from '../types';
import { RotateCcw, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsProps {
  players: Player[];
  onNewGame: () => void;
  onReset: () => void;
}

export function Results({ players, onNewGame, onReset }: ResultsProps) {
  const totalPenalty = players.reduce((sum, p) => sum + (p.isWinner ? 0 : (p.penaltyScore || 0)), 0);

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Final Scores</h2>
        <p className="text-stone-500">Game Over!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {sortedPlayers.map((p, i) => {
          const finalScore = p.isWinner ? totalPenalty : -(p.penaltyScore || 0);
          const isPositive = finalScore > 0;
          const isZero = finalScore === 0;

          return (
            <div key={p.id} className={`p-6 flex items-center justify-between border-b border-stone-100 last:border-0 ${p.isWinner ? 'bg-orange-50/50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 && p.totalScore > 0 ? 'bg-yellow-400 text-yellow-900' : p.isWinner ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{p.name}</h3>
                  {p.isWinner && <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Round Winner</span>}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className={`text-2xl font-mono font-bold ${p.totalScore > 0 ? 'text-emerald-500' : p.totalScore === 0 ? 'text-stone-400' : 'text-red-500'}`}>
                  {p.totalScore > 0 ? '+' : ''}{p.totalScore}
                </div>
                <div className="text-sm text-stone-500 font-mono font-medium">
                  Round: <span className={isPositive ? 'text-emerald-500' : isZero ? 'text-stone-400' : 'text-red-500'}>{isPositive ? '+' : ''}{finalScore}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onNewGame}
          className="w-full bg-stone-900 hover:bg-black text-white font-bold text-lg py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play size={24} />
          Play Next Round
        </button>
        <button
          onClick={onReset}
          className="w-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={24} />
          End Game (Reset All)
        </button>
      </div>
    </motion.div>
  );
}
