export interface Player {
  id: string;
  name: string;
  penaltyScore: number | null;
  scoreBreakdown?: string;
  isWinner: boolean;
}
