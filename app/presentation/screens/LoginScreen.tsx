import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../../shared/theme';

export function LoginScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.dark.gradient.hero[0], theme.dark.gradient.hero[1], theme.dark.gradient.hero[2]]}
          style={styles.heroSection}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[...theme.dark.gradient.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoCircle}
            >
              <Ionicons name="heart" size={36} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.logoText}>Nossa História</Text>
          <Text style={styles.tagline}>Construa memórias juntos</Text>
        </LinearGradient>

        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Bem-vindo de volta</Text>
          <Text style={styles.instructionText}>Entre na sua conta para continuar</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.dark.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.dark.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.dark.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={theme.dark.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.dark.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[...theme.dark.gradient.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Entrar</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
    ...theme.shadow.glow,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: theme.fontSize.xxl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
    marginTop: theme.spacing.xs,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  instructionText: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.dark.border,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    color: theme.dark.text,
    fontSize: theme.fontSize.md,
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginTop: theme.spacing.sm,
    ...theme.shadow.glow,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: '#FFF',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    color: theme.dark.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  footerLink: {
    color: theme.dark.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
