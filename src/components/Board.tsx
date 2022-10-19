import React, { useState } from 'react';
import { Text, StyleSheet, ImageBackground } from 'react-native';
import { theme } from '../theme';

const background = require('../../assets/bg.jpeg');

const initBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export const Board: React.FC = () => {
  const [board, setBoard] = useState(initBoard);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [count, setCount] = useState(0);

  const move = (x: number, y: number): void => {
    // If the square is exist
    if (board[x][y] !== "") return

    // Check col
    for (let i = 0; i < 3; i++) {
      if (board[x][i] !== )
    }

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[x][i])
    }
  };

  return (
    <ImageBackground style={styles.container} source={background}>
      <Text style={styles.headingTitle}>Current Turn:</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  headingTitle: {
    position: 'relative',
    top: 100,
    fontSize: 20,
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorWhite,
    width: '100%',
    textAlign: 'center',
  },
});
