import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-svg';
import CrossLine from './CrossLine';

type Props = {
  cell: string;
  onPress: () => void;
};

const Cell = ({ cell, onPress }: Props) => {
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell === 'o' && <View style={styles.circle} />}
      {cell === 'x' && <CrossLine />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    padding: 10,
  },
  circle: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 5,
    borderColor: 'yellow',
  },
});

export default Cell;
