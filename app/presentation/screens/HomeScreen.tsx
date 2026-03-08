import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';
import { useTimeline } from '../hooks/useTimeline';
import { useMemories } from '../hooks/useMemories';
import { useGoals } from '../hooks/useGoals';
import { theme } from '../../shared/theme';

function formatDays(days: number): string {
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

function getRelationshipMilestone(days: number): string {
  if (days < 30) return 'Início da jornada';
  if (days < 100) return 'Primeiros passos';
  if (days < 365) return 'Construindo juntos';
  if (days < 730) return 'Primeiro ano juntos';
  if (days < 1095) return 'História sendo escrita';
  return 'Uma bela história';
}

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { user } = useAuth();
  const { couple, partner } = useCouple();
  const { events, loading: timelineLoading, refresh: refreshTimeline } = useTimeline();
  const { memories, loading: memoriesLoading, refresh: refreshMemories } = useMemories();
  const { goals, completedCount, loading: goalsLoading, refresh: refreshGoals } = useGoals();
  const [daysTogether, setDaysTogether] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const isInitialLoad = timelineLoading || memoriesLoading || goalsLoading;

  useEffect(() => {
    if (!couple) return;
    const startDate = couple.relationship_start_date
      ? new Date(couple.relationship_start_date)
      : new Date(couple.created_at);
    const now = new Date();
    const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    setDaysTogether(Math.max(0, diff));
  }, [couple]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshTimeline(), refreshMemories(), refreshGoals()]);
    setRefreshing(false);
  }, [refreshTimeline, refreshMemories, refreshGoals]);

  const goalsProgress = goals.length > 0 ? completedCount / goals.length : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.dark.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.safeHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.name ?? 'você'} {partner ? `& ${partner.name}` : ''}
            </Text>
            <Text style={styles.headerTitle}>Nossa História</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={[...theme.dark.gradient.primary]}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileInitial}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.heroCardWrapper}>
        <LinearGradient
          colors={[...theme.dark.gradient.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroDecoration}>
            <Ionicons name="heart" size={120} color="rgba(255,255,255,0.08)" />
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>{getRelationshipMilestone(daysTogether)}</Text>
            <Text style={styles.heroDays}>{formatDays(daysTogether)}</Text>
            <Text style={styles.heroSubtext}>de amor e companheirismo</Text>
          </View>
          <View style={styles.heroHeartRow}>
            <Ionicons name="heart" size={16} color="rgba(255,255,255,0.5)" />
            <Ionicons name="heart" size={12} color="rgba(255,255,255,0.3)" />
            <Ionicons name="heart" size={8} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Memories')}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#FF4D6D18' }]}>
            <Ionicons name="images" size={20} color={theme.dark.primary} />
          </View>
          <Text style={styles.statValue}>{isInitialLoad ? '…' : memories.length}</Text>
          <Text style={styles.statLabel}>Memórias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Timeline')}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B18' }]}>
            <Ionicons name="calendar" size={20} color={theme.dark.warning} />
          </View>
          <Text style={styles.statValue}>{isInitialLoad ? '…' : events.length}</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Goals')}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#22C55E18' }]}>
            <Ionicons name="star" size={20} color={theme.dark.success} />
          </View>
          <Text style={styles.statValue}>{isInitialLoad ? '…' : completedCount}</Text>
          <Text style={styles.statLabel}>Metas</Text>
        </TouchableOpacity>
      </View>

      {goals.length > 0 && (
        <TouchableOpacity
          style={styles.progressCard}
          onPress={() => navigation.navigate('Goals')}
          activeOpacity={0.8}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressTitleRow}>
              <Ionicons name="trophy-outline" size={18} color={theme.dark.warning} />
              <Text style={styles.progressTitle}>Progresso das metas</Text>
            </View>
            <Text style={styles.progressCount}>
              {completedCount}/{goals.length}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[...theme.dark.gradient.warm]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${Math.max(goalsProgress * 100, 2)}%` }]}
            />
          </View>
          <Text style={styles.progressPercent}>
            {Math.round(goalsProgress * 100)}% concluído
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Memories')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF4D6D20', '#FF4D6D08']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="camera-outline" size={24} color={theme.dark.primary} />
              <Text style={styles.quickActionText}>Nova memória</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Timeline')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B20', '#F59E0B08']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.dark.warning} />
              <Text style={styles.quickActionText}>Novo evento</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Goals')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#22C55E20', '#22C55E08']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="flag-outline" size={24} color={theme.dark.success} />
              <Text style={styles.quickActionText}>Nova meta</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingBottom: theme.spacing.xxl,
  },
  safeHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
  },
  profileButton: {
    ...theme.shadow.sm,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: theme.fontSize.lg,
    color: '#FFF',
    fontWeight: theme.fontWeight.bold,
  },
  heroCardWrapper: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.glow,
  },
  heroCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    minHeight: 160,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  heroContent: {
    zIndex: 1,
  },
  heroLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroDays: {
    fontSize: theme.fontSize.hero,
    color: '#FFF',
    fontWeight: theme.fontWeight.heavy,
    marginBottom: 2,
  },
  heroSubtext: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255,255,255,0.7)',
  },
  heroHeartRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.dark.border,
    ...theme.shadow.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textSecondary,
    marginTop: 2,
  },
  progressCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.dark.border,
    ...theme.shadow.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressTitle: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
  },
  progressCount: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.dark.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textSecondary,
    marginTop: theme.spacing.sm,
  },
  quickActionsSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  quickActionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
});
