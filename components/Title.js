import { Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function Title({ title }) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
});
