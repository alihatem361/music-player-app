import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { RootNavigator } from './src/navigation';
import { ThemeProvider, useTheme } from './src/theme';

/** Paints the themed background behind the navigator, including during bootstrap. */
const ThemedRoot: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <RootNavigator />
    </View>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedRoot />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
