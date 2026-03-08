import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './app/presentation/contexts/AuthContext';
import { CoupleProvider, useCouple } from './app/presentation/contexts/CoupleContext';
import { ErrorBoundary } from './app/presentation/components/ErrorBoundary';
import { LoginScreen } from './app/presentation/screens/LoginScreen';
import { RegisterScreen } from './app/presentation/screens/RegisterScreen';
import { ConnectPartnerScreen } from './app/presentation/screens/ConnectPartnerScreen';
import { HomeScreen } from './app/presentation/screens/HomeScreen';
import { TimelineScreen } from './app/presentation/screens/TimelineScreen';
import { MemoriesScreen } from './app/presentation/screens/MemoriesScreen';
import { GoalsScreen } from './app/presentation/screens/GoalsScreen';
import { ProfileScreen } from './app/presentation/screens/ProfileScreen';
import { theme } from './app/shared/theme';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'heart', default: 'heart-outline' },
  Timeline: { focused: 'calendar', default: 'calendar-outline' },
  Memories: { focused: 'images', default: 'images-outline' },
  Goals: { focused: 'star', default: 'star-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: true,
        headerStyle: {
          backgroundColor: theme.dark.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
          fontSize: theme.fontSize.lg,
        },
        headerTintColor: theme.dark.text,
        tabBarStyle: {
          backgroundColor: theme.dark.surface,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...theme.shadow.lg,
        },
        tabBarActiveTintColor: theme.dark.primary,
        tabBarInactiveTintColor: theme.dark.textMuted,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.semibold,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return (
            <View style={[styles.iconWrapper, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início', tabBarLabel: 'Início', headerShown: false }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ title: 'Timeline' }}
      />
      <Tab.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{ title: 'Memórias' }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: 'Metas' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const { loading: coupleLoading } = useCouple();

  if (loading || coupleLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingInner}>
          <ActivityIndicator size="large" color={theme.dark.primary} />
        </View>
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen
        name="ConnectPartner"
        component={ConnectPartnerScreen}
        options={{ presentation: 'modal' }}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CoupleProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </CoupleProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingInner: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.md,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  activeIconContainer: {
    backgroundColor: theme.dark.accentSoft,
    borderWidth: 1,
    borderColor: theme.dark.primary + '40',
  },
});
