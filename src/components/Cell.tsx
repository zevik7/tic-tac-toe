import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import CrossLine from './CrossLine';

type Props = {
  cell: string;
  onPress: () => void;
};

const Cell = (props: Props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell === 'o' && <View style={styles.circle} />}
      {cell === 'x' && <CrossLine />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    flex: 1,
  },
  circle: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,

    borderWidth: 10,
    borderColor: 'white',
  },
});

export default Cell;
