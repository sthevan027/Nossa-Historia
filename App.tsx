import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './app/presentation/contexts/AuthContext';
import { CoupleProvider, useCouple } from './app/presentation/contexts/CoupleContext';
import { LoginScreen } from './app/presentation/screens/LoginScreen';
import { RegisterScreen } from './app/presentation/screens/RegisterScreen';
import { ConnectPartnerScreen } from './app/presentation/screens/ConnectPartnerScreen';
import { HomeScreen } from './app/presentation/screens/HomeScreen';
import { TimelineScreen } from './app/presentation/screens/TimelineScreen';
import { MemoriesScreen } from './app/presentation/screens/MemoriesScreen';
import { GoalsScreen } from './app/presentation/screens/GoalsScreen';
import { ProfileScreen } from './app/presentation/screens/ProfileScreen';
import { theme } from './app/shared/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showRegister ? (
        <Stack.Screen name="Register">
          {() => <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Login">
          {() => <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.dark.background },
        headerTintColor: theme.dark.text,
        tabBarStyle: { backgroundColor: theme.dark.surface },
        tabBarActiveTintColor: theme.dark.primary,
        tabBarInactiveTintColor: theme.dark.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início', tabBarLabel: 'Início', tabBarIcon: () => <Text>❤️</Text> }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ title: 'Linha do tempo', tabBarLabel: 'Timeline', tabBarIcon: () => <Text>📅</Text> }}
      />
      <Tab.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{ title: 'Memórias', tabBarLabel: 'Memórias', tabBarIcon: () => <Text>📸</Text> }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: 'Metas', tabBarLabel: 'Metas', tabBarIcon: () => <Text>✨</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', tabBarLabel: 'Perfil', tabBarIcon: () => <Text>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const { couple, loading: coupleLoading } = useCouple();

  if (loading || coupleLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.dark.primary} />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  if (!couple || couple.user1_id === couple.user2_id) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ConnectPartner" component={ConnectPartnerScreen} />
      </Stack.Navigator>
    );
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <AuthProvider>
      <CoupleProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </CoupleProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
