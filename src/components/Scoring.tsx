import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { Camera, CheckCircle2, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';

interface ScoringProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onFinish: () => void;
}

export function Scoring({ players, setPlayers, onFinish }: ScoringProps) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);

  const handleSetWinner = (id: string) => {
    setPlayers(players.map(p => ({
      ...p,
      isWinner: p.id === id,
      penaltyScore: p.id === id ? 0 : p.penaltyScore
    })));
  };

  const handleManualScore = (id: string, scoreStr: string) => {
    const score = parseInt(scoreStr, 10);
    setPlayers(players.map(p => p.id === id ? { ...p, penaltyScore: isNaN(score) ? null : score } : p));
  };

  const triggerCamera = (id: string) => {
    setTargetPlayerId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetPlayerId) return;

    setAnalyzingId(targetPlayerId);
    setError(null);

    try {
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1024;
              const MAX_HEIGHT = 1024;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              resolve(dataUrl.split(',')[1]);
            };
            img.onerror = (error) => reject(error);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      const base64Image = await compressImage(file);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
              }
            },
            {
              text: "Analyze this image of Rummikub tiles. Calculate the total penalty score. Number tiles are worth their face value (1-13). Joker tiles (usually with a smiling face) are worth 30 points. Count every tile you see. Return a JSON object with 'score' (integer) and 'breakdown' (string showing the calculation, e.g., '6 + 6 + 6 + 8')."
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              breakdown: { type: Type.STRING }
            },
            required: ["score", "breakdown"]
          }
        }
      });

      const result = JSON.parse(response.text);
      
      setPlayers(players.map(p => 
        p.id === targetPlayerId ? { ...p, penaltyScore: result.score, scoreBreakdown: result.breakdown } : p
      ));

    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || 'Unknown error';
      if (errorMessage.includes('429') || errorMessage.includes('Quota')) {
        errorMessage = 'API quota exceeded. Please wait a moment and try again, or use a different API key.';
      } else if (errorMessage.length > 100) {
        errorMessage = 'An error occurred while analyzing the image.';
      }
      setError(`Failed to analyze image: ${errorMessage}`);
    } finally {
      setAnalyzingId(null);
      setTargetPlayerId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const allScored = players.every(p => p.penaltyScore !== null);
  const hasWinner = players.some(p => p.isWinner);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-900">Calculate Scores</h2>
        <p className="text-stone-500 mt-2">Who won? Take photos of the remaining tiles for the others.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <p>{error}</p>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className="space-y-4">
        {players.map(p => (
          <div key={p.id} className={`bg-white p-5 rounded-2xl shadow-sm border transition-colors ${p.isWinner ? 'border-orange-500 ring-1 ring-orange-500' : 'border-stone-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {p.name}
                {p.isWinner && <Trophy size={18} className="text-orange-500" />}
              </h3>
              {!hasWinner && (
                <button 
                  onClick={() => handleSetWinner(p.id)}
                  className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100"
                >
                  Set as Winner
                </button>
              )}
              {hasWinner && p.isWinner && (
                <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                  Winner
                </span>
              )}
            </div>

            {!p.isWinner && hasWinner && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 block">Penalty Score</label>
                    <input
                      type="number"
                      value={p.penaltyScore === null ? '' : p.penaltyScore}
                      onChange={(e) => handleManualScore(p.id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => triggerCamera(p.id)}
                      disabled={analyzingId !== null}
                      className="h-[52px] px-4 bg-stone-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
                    >
                      {analyzingId === p.id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Camera size={20} />
                      )}
                      <span className="hidden sm:inline">Scan</span>
                    </button>
                  </div>
                </div>
                {p.scoreBreakdown && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-sm text-stone-600">
                    <span className="font-semibold text-stone-700">Calculation:</span> {p.scoreBreakdown}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={!allScored || !hasWinner}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        <CheckCircle2 size={24} />
        Show Final Results
      </button>
    </motion.div>
  );
}
