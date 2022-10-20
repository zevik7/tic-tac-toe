import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import format from 'date-fns/format';
import { Game } from '../types';
import { theme } from '../theme';
import { useAppContext } from '../App.provider';

type GameItemRowProps = {
  item: Game;
};

export const GameItemRow: React.FC<GameItemRowProps> = ({ item }) => {
  const appContext = useAppContext();

  const handleDelete = React.useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    appContext.handleDeleteGame(item);
  }, [appContext, item]);

  return (
    <View style={styles.gameItem}>
      <View>
        <Text
          style={[
            styles.result,
            item.result === 'Win' ? styles.win : styles.lose,
          ]}>
          {item.result}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.date}>
          {format(new Date(item.timestamp), "dd MMM, yyyy 'at' h:mmaaa")}
        </Text>
      </View>
      <Pressable onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    textAlign: 'center',
    color: theme.colorGrey,
    fontFamily: theme.fontFamilyRegular,
    fontStyle: 'italic',
    fontSize: 12,
  },
  gameItem: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  result: {
    fontSize: 22,
    fontFamily: theme.fontFamilyRegular,
  },
  win: {
    color: theme.colorGreen,
  },
  lose: {
    color: theme.colorRed,
  },
  userName: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: theme.fontFamilyRegular,
  },
  deleteText: {
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorBlue,
  },
});
