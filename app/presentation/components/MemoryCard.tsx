import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.imageContainer}>
        {memory.photo_url ? (
          <>
            <Image source={{ uri: memory.photo_url }} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageOverlay}
            />
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#FFF" />
              <Text style={styles.dateBadgeText}>{formatDate(memory.memory_date)}</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderIconContainer}>
              <Ionicons name="image-outline" size={32} color={theme.dark.textMuted} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {memory.title}
        </Text>
        {memory.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {memory.description}
          </Text>
        ) : null}
        {!memory.photo_url && (
          <View style={styles.dateLine}>
            <Ionicons name="calendar-outline" size={12} color={theme.dark.textMuted} />
            <Text style={styles.dateText}>{formatDate(memory.memory_date)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.dark.border,
    ...theme.shadow.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  dateBadge: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  dateBadgeText: {
    fontSize: theme.fontSize.xs,
    color: '#FFF',
    fontWeight: theme.fontWeight.medium,
  },
  placeholder: {
    width: '100%',
    height: 160,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  dateLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textMuted,
  },
});
