import React from 'react';
import { Game } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = 'my-app-data';

type AppData = {
  games: Game[];
};

const getAppData = async (): Promise<AppData | null> => {
  try {
    const data = await AsyncStorage.getItem(storageKey);

    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch {
    return null;
  }
};

const setAppData = async (newData: AppData): Promise<void> => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
  } catch {}
};

type Props = {
  children: any;
};

type AppContextType = {
  games: Game[];
  handleSaveGame: (game: Game) => void;
  handleDeleteGame: (game: Game) => void;
};

const defaultValue = {
  games: [],
  handleSaveGame: () => {},
  handleDeleteGame: () => {},
};

const AppContext = React.createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [games, setGames] = React.useState<Game[]>([]);

  const handleSaveGame = React.useCallback((game: Game) => {
    setGames(current => {
      const newGames: Game[] = [game, ...current];
      setAppData({ games: newGames });
      return newGames;
    });
  }, []);

  const handleDeleteGame = React.useCallback((game: Game) => {
    setGames(current => {
      const newGames = current.filter(
        gameItem => gameItem.timestamp !== game.timestamp,
      );

      setAppData({ games: newGames });
      return newGames;
    });
  }, []);

  React.useEffect(() => {
    const fetchAppData = async () => {
      const data = await getAppData();

      if (data) {
        setGames(data.games);
      }
    };
    fetchAppData();
  }, []);

  return (
    <AppContext.Provider value={{ games, handleSaveGame, handleDeleteGame }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
