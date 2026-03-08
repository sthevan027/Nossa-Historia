import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TimelineEvent } from '../../core/types';
import { theme } from '../../shared/theme';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast?: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TimelineItem({ event, isLast }: TimelineItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timelineTrack}>
        <View style={styles.dotOuter}>
          <View style={styles.dotInner} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{event.emoji ?? '❤️'}</Text>
          <Text style={styles.date}>{formatDate(event.event_date)}</Text>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        {event.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {event.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  timelineTrack: {
    alignItems: 'center',
    width: 32,
    marginRight: theme.spacing.md,
  },
  dotOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.dark.primary,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: theme.dark.border,
    marginTop: theme.spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.dark.border,
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  emoji: {
    fontSize: 20,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    lineHeight: 20,
  },
});
