import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function Input({ title, placeholder, value, onChangeText, secureTextEntry, error }) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.label}>{title}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.primaryText,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.errorColorPrimary,
  },
});

