import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Loader } from '../components';
import { restoreSession } from '../features/auth/authSlice';
import { useTheme } from '../theme';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { buildNavigationTheme } from './navigationTheme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBootstrapping = useAppSelector((state) => state.auth.isBootstrapping);
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.tokens?.access));

  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  if (isBootstrapping) {
    return <Loader label="Loading your music…" />;
  }

  return (
    <NavigationContainer theme={buildNavigationTheme(theme)}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};
