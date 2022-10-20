import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppContext } from '../App.provider';
import { GameItemRow } from '../components/GameItemRow';

export const History: React.FC = () => {
  const appContext = useAppContext();

  return (
    <ScrollView>
      <View style={styles.container}>
        {appContext.games.map(item => (
          <GameItemRow item={item} key={item.timestamp} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});
