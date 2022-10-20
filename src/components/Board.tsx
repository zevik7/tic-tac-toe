import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Input } from '@rneui/themed';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import Cell from './Cell';
import { useAppContext } from '../App.provider';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const { handleSaveGame, games } = useAppContext();

  const onMove = (x: number, y: number): void => {
    // If the name is not exist
    if (!userName) {
      setModalVisible(true);
      return;
    }
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
      if (result) {
        let resultMsg = '';
        switch (result) {
          case 'x':
            resultMsg = 'You are the winner';
            break;
          case 'o':
            resultMsg = 'Computer is the winner';
            break;
          case 'draw':
            resultMsg = "It's a draw";
            break;

          default:
            break;
        }

        Alert.alert('Result', resultMsg, [
          {
            text: 'Reset',
            onPress: resetGame,
          },
          {
            text: 'New Game',
            onPress: playNewGame,
          },
        ]);

        handleSaveGame({
          userName,
          result: result === 'x' ? 'Win' : 'Lose',
          timestamp: Date.now(),
        });

        console.log(games);

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
    setIndicatorLoading(true);
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
    setUserName('');
  };

  const playNewGame = () => {
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
    <ImageBackground source={background}>
      <View
        style={styles.container}
        pointerEvents={indicatorLoading ? 'none' : 'auto'}>
        <Text style={styles.mainTitle}>{`Hello ${userName}`}</Text>
        <View style={styles.header}>
          <ActivityIndicator
            style={styles.headerIndicator}
            size="large"
            color="#fff"
            animating={indicatorLoading}
          />
          <Text style={styles.subTitle}>
            {userName && nextTurn === 'x' && 'Your turn'}
            {userName && nextTurn === 'o' && 'Computer turn'}
          </Text>
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
        {!userName ? (
          <Pressable
            style={styles.startButtonBox}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.button}>Start</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.startButtonBox} onPress={resetGame}>
            <Text style={styles.button}>Reset</Text>
          </Pressable>
        )}

        {/* Modal for inputting name */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setUserName('');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  setModalVisible(false);
                  setUserName('');
                }}>
                <Icon name="close-a" size={18} />
              </TouchableOpacity>
              <Input
                placeholder="Enter your name"
                value={userName}
                onChangeText={(text: string) => setUserName(text)}
                containerStyle={styles.modalInput}
              />
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.button}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    position: 'absolute',
    top: 140,
    fontSize: 20,
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorWhite,
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    top: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    width: '100%',
    textAlign: 'right',
  },
  subTitle: {
    fontSize: 14,
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorWhite,
  },
  headerIndicator: {
    marginRight: 10,
  },
  startButtonBox: {
    position: 'absolute',
    bottom: 100,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: theme.colorBlue,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalView: {
    position: 'relative',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    backgroundColor: theme.colorWhite,
    paddingTop: 5,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  buttonClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
