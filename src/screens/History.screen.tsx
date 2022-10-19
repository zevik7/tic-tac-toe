import React from 'react';
import { ScrollView } from 'react-native';
import { useAppContext } from '../App.provider';
import { GameItemRow } from '../components/GameItemRow';

export const History: React.FC = () => {
  const appContext = useAppContext();

  return (
    <ScrollView>
      {appContext.games.map(item => (
        <GameItemRow item={item} key={item.timestamp} />
      ))}
    </ScrollView>
  );
};
