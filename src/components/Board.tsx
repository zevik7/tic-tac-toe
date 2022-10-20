import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import Cell from './Cell';

const background = require('../../assets/bg.jpeg');

const initBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type MoveOption = {
  x: any;
  y: any;
};

export const Board: React.FC = () => {
  const [board, setBoard] = useState(initBoard);
  const [count, setCount] = useState(0);
  const [nextTurn, setNextTurn] = useState('x');
  const [lastMove, setLastMove] = useState<MoveOption>({
    x: undefined,
    y: undefined,
  });
  const [indicatorLoading, setIndicatorLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const onMove = (x: number, y: number): void => {
    // If the square is exist
    if (board[x][y] !== '') {
      return;
    }

    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      newBoard[x][y] = nextTurn;
      return newBoard;
    });

    setCount(count + 1);

    setLastMove({ x, y });

    setNextTurn(nextTurn === 'x' ? 'o' : 'x');
  };

  useEffect(() => {
    if (lastMove.x !== undefined && lastMove.y !== undefined) {
      // Find the winner
      const result = getResult();
      if (result === 'x' || result === 'o') {
        Alert.alert('Result', `${result.toLocaleUpperCase()} is the winner`, [
          {
            text: 'Reset',
            onPress: resetGame,
          },
        ]);
        return;
      }

      if (result === 'draw') {
        Alert.alert('Result', "It's a draw", [
          {
            text: 'Reset',
            onPress: resetGame,
          },
        ]);
        return;
      }
    }

    // Bot move
    if (nextTurn === 'o' && count < 9) {
      getBotMove();
    }
  }, [nextTurn]);

  const getResult = () => {
    const currentTurn = nextTurn === 'o' ? 'x' : 'o';
    // Check cols
    for (let i = 0; i < 3; i++) {
      if (board[lastMove.x][i] !== currentTurn) {
        break;
      }
      if (i === 2) {
        return currentTurn;
      }
    }

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][lastMove.y] !== currentTurn) {
        break;
      }
      if (i === 2) {
        return currentTurn;
      }
    }

    // Check diag
    if (lastMove.x === lastMove.y) {
      for (let i = 0; i < 3; i++) {
        if (board[i][i] !== currentTurn) {
          break;
        }
        if (i === 2) {
          return currentTurn;
        }
      }
    }

    // Check anti diag
    if (lastMove.x + lastMove.y === 2) {
      for (let i = 0; i < 3; i++) {
        if (board[i][2 - i] !== currentTurn) {
          break;
        }
        if (i === 2) {
          return currentTurn;
        }
      }
    }

    if (count === 9) {
      return 'draw';
    }

    return null;
  };

  const getBotMove = () => {
    const possibleOptions: MoveOption[] = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === '') {
          possibleOptions.push({ x: rowIndex, y: columnIndex });
        }
      });
    });

    const randomMove =
      possibleOptions[getRandom(0, possibleOptions.length - 1)];

    setIndicatorLoading(true);
    setTimeout(() => {
      onMove(randomMove.x, randomMove.y);
      setIndicatorLoading(false);
    }, 700);
  };

  const resetGame = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setCount(0);
    setLastMove({ x: undefined, y: undefined });
    setNextTurn('x');
  };

  return (
    <ImageBackground style={styles.container} source={background}>
      <View style={styles.heading}>
        <Text style={styles.headingTitle}>
          {(count > 0 && `Next Turn: ${nextTurn.toUpperCase()}`) ||
            "Let's start"}
        </Text>
        <ActivityIndicator
          style={styles.headingIndicator}
          size="large"
          color="#fff"
          animating={indicatorLoading}
        />
      </View>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <Cell
                key={`col-${columnIndex}`}
                cell={cell}
                onPress={() => onMove(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>
      <Pressable style={styles.clearButtonBox} onPress={resetGame}>
        <Text style={styles.clearButton}>Clear</Text>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    position: 'absolute',
    top: 150,
    width: '100%',
    textAlign: 'center',
  },
  headingTitle: {
    fontSize: 20,
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorWhite,
    textAlign: 'center',
  },
  headingIndicator: {
    position: 'absolute',
    top: 0,
    right: 20,
  },
  clearButtonBox: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: theme.colorBlue,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearButton: {
    color: theme.colorWhite,
    fontFamily: theme.fontFamilyRegular,
    fontSize: 14,
  },
  board: {
    top: 20,
    width: 350,
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
