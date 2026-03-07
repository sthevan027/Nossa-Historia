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
import { TimelineItem } from '../components/TimelineItem';
import { SupabaseTimelineRepository } from '../../data/repositories/SupabaseTimelineRepository';
import type { TimelineEvent } from '../../core/types';
import { theme } from '../../shared/theme';

const timelineRepo = new SupabaseTimelineRepository();

export function TimelineScreen() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const loadEvents = async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await timelineRepo.getByCoupleId(couple.id);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [couple?.id]);

  const handleAdd = async () => {
    if (!couple || !user || !title.trim()) return;
    setSaving(true);
    try {
      await timelineRepo.create({
        couple_id: couple.id,
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate,
        created_by: user.id,
      });
      setTitle('');
      setDescription('');
      setEventDate(new Date().toISOString().split('T')[0]);
      setModalVisible(false);
      await loadEvents();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível adicionar');
    } finally {
      setSaving(false);
    }
  };

  if (!couple) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Conecte seu parceiro para ver a linha do tempo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TimelineItem event={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum evento ainda. Adicione o primeiro!</Text>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEvents} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor={theme.dark.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Descrição (opcional)"
              placeholderTextColor={theme.dark.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Data (YYYY-MM-DD)"
              placeholderTextColor={theme.dark.textSecondary}
              value={eventDate}
              onChangeText={setEventDate}
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
  inputMultiline: {
    minHeight: 80,
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
