import React from 'react';
import { View, StyleSheet } from 'react-native';

const CrossLine = () => {
  return (
    <View style={styles.cross}>
      <View style={styles.crossLine} />
      <View style={[styles.crossLine, styles.crossLineReversed]} />
    </View>
  );
};

const styles = StyleSheet.create({
  cross: {
    flex: 1,
  },
  crossLine: {
    position: 'absolute',
    left: '45%',
    width: 5,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
  crossLineReversed: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
});

export default CrossLine;
