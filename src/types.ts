export type MoodOptionType = {
  emoji: string;
  description: string;
};

export type MoodOptionWithTimestamp = {
  mood: MoodOptionType;
  timestamp: number;
};

export type Game = {
  result: 'win' | 'lose';
  timestamp: number;
};
