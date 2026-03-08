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
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../../shared/theme';

export function ConnectPartnerScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { generateInviteCode, joinWithCode, refresh } = useCouple();
  const { signOut } = useAuth();
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
      if (navigation.canGoBack()) navigation.goBack();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Código inválido ou expirado');
    } finally {
      setJoining(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : signOut()} style={styles.logoutButton}>
          <Ionicons
            name={navigation.canGoBack() ? 'close' : 'log-out-outline'}
            size={22}
            color={theme.dark.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.emojiContainer}>
          <Text style={styles.heroEmoji}>💞</Text>
        </View>
        <Text style={styles.title}>Conectar parceiro(a)</Text>
        <Text style={styles.subtitle}>
          Gere um código e envie para seu parceiro, ou digite o código que recebeu
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="paper-plane-outline" size={18} color={theme.dark.primary} />
          </View>
          <Text style={styles.cardTitle}>Enviar convite</Text>
        </View>

        {inviteCode ? (
          <View style={styles.codeDisplay}>
            <Text style={styles.codeLabel}>Seu código:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{inviteCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.shareAgainButton}
              onPress={() =>
                Share.share({
                  message: `Junte-se a mim no Nossa História! Use o código: ${inviteCode}`,
                })
              }
            >
              <Ionicons name="share-outline" size={16} color={theme.dark.primary} />
              <Text style={styles.shareAgainText}>Compartilhar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.buttonDisabled]}
            onPress={handleGenerateCode}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[...theme.dark.gradient.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.generateButtonInner}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={18} color="#FFF" />
                  <Text style={styles.generateButtonText}>Gerar e enviar convite</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerBadge}>
          <Text style={styles.dividerText}>ou</Text>
        </View>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="key-outline" size={18} color={theme.dark.primary} />
          </View>
          <Text style={styles.cardTitle}>Tenho um código</Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="keypad-outline" size={20} color={theme.dark.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Código (ex: A8F2K9)"
            placeholderTextColor={theme.dark.textMuted}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={[styles.joinButton, joining && styles.buttonDisabled]}
          onPress={handleJoin}
          disabled={joining}
          activeOpacity={0.85}
        >
          {joining ? (
            <ActivityIndicator color={theme.dark.primary} />
          ) : (
            <>
              <Ionicons name="link-outline" size={18} color={theme.dark.primary} />
              <Text style={styles.joinButtonText}>Conectar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    marginBottom: theme.spacing.sm,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.dark.border,
    ...theme.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
  },
  generateButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadow.glow,
  },
  generateButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: theme.spacing.sm,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  codeDisplay: {
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  codeBox: {
    backgroundColor: theme.dark.background,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.dark.primary,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: theme.fontSize.xxl,
    color: theme.dark.primary,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 6,
  },
  shareAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  shareAgainText: {
    color: theme.dark.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.dark.border,
  },
  dividerBadge: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.dark.border,
    marginHorizontal: theme.spacing.md,
  },
  dividerText: {
    color: theme.dark.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark.background,
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: theme.dark.text,
    fontSize: theme.fontSize.lg,
    letterSpacing: 2,
    fontWeight: theme.fontWeight.semibold,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    gap: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.dark.primary,
    backgroundColor: theme.dark.accentSoft,
  },
  joinButtonText: {
    color: theme.dark.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
