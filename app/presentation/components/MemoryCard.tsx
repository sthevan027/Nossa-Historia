import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Memory } from '../../core/types';
import { theme } from '../../shared/theme';

interface MemoryCardProps {
  memory: Memory;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <View style={styles.container}>
      {memory.photo_url ? (
        <Image source={{ uri: memory.photo_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📷</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {memory.title}
        </Text>
        {memory.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {memory.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{formatDate(memory.memory_date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 160,
  },
  placeholder: {
    width: '100%',
    height: 160,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: theme.spacing.md,
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
