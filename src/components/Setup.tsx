import React, { useState } from 'react';
import { Player } from '../types';
import { Plus, Trash2, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface SetupProps {
  onStart: (players: Player[], timeLimit: number) => void;
  initialPlayers?: Player[];
  initialTimeLimit?: number;
}

export function Setup({ onStart, initialPlayers, initialTimeLimit }: SetupProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers || [
    { id: '1', name: '玩家 1', penaltyScore: null, isWinner: false, totalScore: 0 },
    { id: '2', name: '玩家 2', penaltyScore: null, isWinner: false, totalScore: 0 },
  ]);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit || 60);

  const addPlayer = () => {
    if (players.length >= 4) return;
    setPlayers([...players, { id: Date.now().toString(), name: `玩家 ${players.length + 1}`, penaltyScore: null, isWinner: false, totalScore: 0 }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-lg font-semibold mb-4">玩家列表</h2>
        <div className="space-y-3">
          {players.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <input
                type="text"
                value={p.name}
                onChange={(e) => updateName(p.id, e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="玩家名稱"
              />
              {players.length > 2 && (
                <button onClick={() => removePlayer(p.id)} className="p-2 text-stone-400 hover:text-red-500 shrink-0">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        {players.length < 4 && (
          <button onClick={addPlayer} className="mt-4 flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
            <Plus size={20} /> 新增玩家
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-lg font-semibold mb-4">每回合限時</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="30"
            max="120"
            step="10"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="flex-1 accent-orange-500"
          />
          <div className="w-16 text-center font-mono text-lg font-semibold bg-stone-100 py-1 rounded-lg">
            {timeLimit}s
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(players, timeLimit)}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors"
      >
        <Play fill="currentColor" size={24} />
        開始遊戲
      </button>
    </motion.div>
  );
}
