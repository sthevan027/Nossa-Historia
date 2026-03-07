import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TimelineEvent } from '../../core/types';
import { theme } from '../../shared/theme';

interface TimelineItemProps {
  event: TimelineEvent;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TimelineItem({ event }: TimelineItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.emoji}>{event.emoji ?? '❤️'}</Text>
        <Text style={styles.title}>{event.title}</Text>
        {event.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{formatDate(event.event_date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.dark.primary,
    marginTop: 6,
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  emoji: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: '600',
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginTop: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
