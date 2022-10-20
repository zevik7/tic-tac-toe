export type MoodOptionType = {
  emoji: string;
  description: string;
};

export type MoodOptionWithTimestamp = {
  mood: MoodOptionType;
  timestamp: number;
};

export type Game = {
  userName: string;
  result: 'Win' | 'Lose';
  timestamp: number;
};
