import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseGoalRepository } from '../../data/repositories/SupabaseGoalRepository';
import type { Goal } from '../../core/types';
import { theme } from '../../shared/theme';

const goalRepo = new SupabaseGoalRepository();

interface GoalItemProps {
  goal: Goal;
  onToggle: () => void;
}

function GoalItem({ goal, onToggle }: GoalItemProps) {
  return (
    <TouchableOpacity style={styles.goalItem} onPress={onToggle}>
      <Text style={styles.checkbox}>{goal.completed ? '☑' : '☐'}</Text>
      <Text
        style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}
        numberOfLines={1}
      >
        {goal.emoji ? `${goal.emoji} ` : ''}{goal.title}
      </Text>
    </TouchableOpacity>
  );
}

export function GoalsScreen() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [saving, setSaving] = useState(false);

  const loadGoals = async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await goalRepo.getByCoupleId(couple.id);
      setGoals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [couple?.id]);

  const handleToggle = async (goal: Goal) => {
    try {
      await goalRepo.toggleComplete(goal.id, !goal.completed);
      await loadGoals();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível atualizar');
    }
  };

  const handleAdd = async () => {
    if (!couple || !user || !title.trim()) return;
    setSaving(true);
    try {
      await goalRepo.create({
        couple_id: couple.id,
        title: title.trim(),
        emoji: emoji.trim() || undefined,
        created_by: user.id,
      });
      setTitle('');
      setEmoji('');
      setModalVisible(false);
      await loadGoals();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível adicionar');
    } finally {
      setSaving(false);
    }
  };

  if (!couple) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Conecte seu parceiro para ver as metas</Text>
      </View>
    );
  }

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stats}>
          {completedCount} de {goals.length} realizadas
        </Text>
      </View>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalItem goal={item} onToggle={() => handleToggle(item)} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma meta ainda. Adicione a primeira!</Text>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadGoals} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Emoji (opcional)"
              placeholderTextColor={theme.dark.textSecondary}
              value={emoji}
              onChangeText={setEmoji}
            />
            <TextInput
              style={styles.input}
              placeholder="Título da meta"
              placeholderTextColor={theme.dark.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonTextSecondary}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, saving && styles.buttonDisabled]}
                onPress={handleAdd}
                disabled={saving}
              >
                <Text style={styles.buttonText}>Salvar</Text>
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
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  stats: {
    color: theme.dark.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.dark.textSecondary,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  checkbox: {
    fontSize: theme.fontSize.lg,
    marginRight: theme.spacing.md,
  },
  goalTitle: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.dark.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: theme.dark.background,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.dark.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.dark.text,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.dark.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.dark.text,
    marginBottom: theme.spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    backgroundColor: theme.dark.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.dark.background,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: theme.dark.text,
  },
});
