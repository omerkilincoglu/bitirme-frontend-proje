import { Pressable, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function Button({ title, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, danger && { backgroundColor: colors.errorColorPrimary }]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.purple1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
