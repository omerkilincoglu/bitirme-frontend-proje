import { Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function Message({ text, type = 'error' }) {
  return <Text style={[styles.message, type === 'error' && styles.error]}>{text}</Text>;
}

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'center',
  },
  error: {
    color: colors.errorColorPrimary,
  },
});
