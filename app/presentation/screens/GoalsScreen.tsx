import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCouple } from '../contexts/CoupleContext';
import { useGoals } from '../hooks/useGoals';
import type { Goal } from '../../core/types';
import { theme } from '../../shared/theme';

interface GoalItemProps {
  goal: Goal;
  onToggle: () => void;
}

function GoalItem({ goal, onToggle }: GoalItemProps) {
  return (
    <TouchableOpacity style={styles.goalItem} onPress={onToggle} activeOpacity={0.75}>
      <View style={[styles.checkbox, goal.completed && styles.checkboxCompleted]}>
        {goal.completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </View>
      <View style={styles.goalContent}>
        <Text
          style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}
          numberOfLines={1}
        >
          {goal.emoji ? `${goal.emoji} ` : ''}{goal.title}
        </Text>
      </View>
      {goal.completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>Feito</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function GoalsScreen() {
  const { couple } = useCouple();
  const { goals, loading, refresh, add, toggle, completedCount } = useGoals();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [saving, setSaving] = useState(false);

  const handleToggle = async (goal: Goal) => {
    try {
      await toggle(goal.id, !goal.completed);
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível atualizar');
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await add({
        title: title.trim(),
        emoji: emoji.trim() || undefined,
      });
      setTitle('');
      setEmoji('');
      setModalVisible(false);
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível adicionar');
    } finally {
      setSaving(false);
    }
  };

  if (!couple) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="star-outline" size={48} color={theme.dark.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Metas do Casal</Text>
        <Text style={styles.emptyText}>Conecte seu parceiro para criar metas juntos</Text>
      </View>
    );
  }

  const progress = goals.length > 0 ? completedCount / goals.length : 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalItem goal={item} onToggle={() => handleToggle(item)} />}
        contentContainerStyle={[
          styles.list,
          goals.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          goals.length > 0 ? (
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Progresso do casal</Text>
                <Text style={styles.progressValue}>
                  {completedCount} de {goals.length}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[...theme.dark.gradient.warm]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${Math.max(progress * 100, 3)}%` }]}
                />
              </View>
              <Text style={styles.progressPercent}>
                {Math.round(progress * 100)}% concluído
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <View style={styles.emptyListIconContainer}>
              <Ionicons name="flag-outline" size={32} color={theme.dark.primary} />
            </View>
            <Text style={styles.emptyListTitle}>Definam suas metas!</Text>
            <Text style={styles.emptyListText}>
              Criem objetivos para alcançar juntos
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.dark.primary} />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <LinearGradient
          colors={[...theme.dark.gradient.primary]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova meta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={theme.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.emojiInput}
                placeholder="😊"
                value={emoji}
                onChangeText={setEmoji}
                maxLength={2}
              />
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.input}
                placeholder="Título da meta"
                placeholderTextColor={theme.dark.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.buttonDisabled]}
                onPress={handleAdd}
                disabled={saving}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[...theme.dark.gradient.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyListIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyListTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  emptyListText: {
    fontSize: theme.fontSize.md,
    color: theme.dark.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressLabel: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.semibold,
  },
  progressValue: {
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
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.xs,
    borderWidth: 2,
    borderColor: theme.dark.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: theme.dark.success,
    borderColor: theme.dark.success,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.medium,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.dark.textMuted,
  },
  completedBadge: {
    backgroundColor: theme.dark.success + '20',
    borderRadius: theme.borderRadius.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  completedBadgeText: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.success,
    fontWeight: theme.fontWeight.medium,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    ...theme.shadow.glow,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.dark.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.dark.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.dark.border,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.bold,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  emojiInput: {
    fontSize: 24,
    textAlign: 'center',
    width: 44,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  },
  inputSeparator: {
    width: 1,
    height: 24,
    backgroundColor: theme.dark.border,
    marginHorizontal: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: theme.dark.text,
    fontSize: theme.fontSize.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  cancelButtonText: {
    color: theme.dark.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  saveButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadow.glow,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
