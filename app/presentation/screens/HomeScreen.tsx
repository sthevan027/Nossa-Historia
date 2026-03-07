import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseTimelineRepository } from '../../data/repositories/SupabaseTimelineRepository';
import { SupabaseMemoryRepository } from '../../data/repositories/SupabaseMemoryRepository';
import { SupabaseGoalRepository } from '../../data/repositories/SupabaseGoalRepository';
import { theme } from '../../shared/theme';

const timelineRepo = new SupabaseTimelineRepository();
const memoryRepo = new SupabaseMemoryRepository();
const goalRepo = new SupabaseGoalRepository();

function formatDays(days: number): string {
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

export function HomeScreen() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [daysTogether, setDaysTogether] = useState(0);
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    if (!couple) return;
    try {
      const [events, memories, goals] = await Promise.all([
        timelineRepo.getByCoupleId(couple.id),
        memoryRepo.getByCoupleId(couple.id),
        goalRepo.getByCoupleId(couple.id),
      ]);
      setEventsCount(events.length);
      setMemoriesCount(memories.length);
      const completed = goals.filter((g) => g.completed).length;
      setGoalsCount(completed);

      const startDate = couple.relationship_start_date
        ? new Date(couple.relationship_start_date)
        : new Date(couple.created_at);
      const now = new Date();
      const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setDaysTogether(Math.max(0, diff));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadStats();
  }, [couple?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name ?? 'você'}!</Text>
        <Text style={styles.title}>❤️ Nossa História</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardValue}>{formatDays(daysTogether)}</Text>
        <Text style={styles.cardLabel}>juntos</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{memoriesCount}</Text>
          <Text style={styles.statLabel}>Memórias</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{eventsCount}</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{goalsCount}</Text>
          <Text style={styles.statLabel}>Metas</Text>
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
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
  },
  card: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardValue: {
    fontSize: theme.fontSize.xxl,
    color: theme.dark.primary,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textSecondary,
  },
});
