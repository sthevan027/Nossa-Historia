import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useCouple } from '../contexts/CoupleContext';
import { theme } from '../../shared/theme';

export function ConnectPartnerScreen() {
  const { generateInviteCode, joinWithCode, refresh } = useCouple();
  const [code, setCode] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const c = await generateInviteCode();
      setInviteCode(c);
      await Share.share({
        message: `Junte-se a mim no Nossa História! Use o código: ${c}`,
        title: 'Convite - Nossa História',
      });
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível gerar o código');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert('Erro', 'Digite o código');
      return;
    }
    setJoining(true);
    try {
      await joinWithCode(code.trim().toUpperCase());
      await refresh();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Código inválido ou expirado');
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectar parceiro(a)</Text>
      <Text style={styles.subtitle}>
        Gere um código e envie para seu parceiro, ou digite o código que ele te enviou.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerar código</Text>
        {inviteCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGenerateCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.dark.background} />
            ) : (
              <Text style={styles.buttonText}>Gerar e enviar convite</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entrar com código</Text>
        <TextInput
          style={styles.input}
          placeholder="Código (ex: A8F2K9)"
          placeholderTextColor={theme.dark.textSecondary}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary, joining && styles.buttonDisabled]}
          onPress={handleJoin}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color={theme.dark.primary} />
          ) : (
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Conectar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  codeBox: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  codeText: {
    fontSize: theme.fontSize.xxl,
    color: theme.dark.primary,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  input: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.dark.text,
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSize.md,
  },
  button: {
    backgroundColor: theme.dark.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.dark.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.dark.background,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: theme.dark.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.dark.border,
  },
  dividerText: {
    color: theme.dark.textSecondary,
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.sm,
  },
});
