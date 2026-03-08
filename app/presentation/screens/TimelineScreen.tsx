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
import { TimelineItem } from '../components/TimelineItem';
import { useTimeline } from '../hooks/useTimeline';
import { theme } from '../../shared/theme';

export function TimelineScreen() {
  const { couple } = useCouple();
  const { events, loading, refresh, add } = useTimeline();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await add({
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate,
      });
      setTitle('');
      setDescription('');
      setEventDate(new Date().toISOString().split('T')[0]);
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
          <Ionicons name="calendar-outline" size={48} color={theme.dark.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Linha do Tempo</Text>
        <Text style={styles.emptyText}>Conecte seu parceiro para começar a registrar momentos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TimelineItem event={item} />
        )}
        contentContainerStyle={[
          styles.list,
          events.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          events.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {events.length} {events.length === 1 ? 'momento' : 'momentos'} registrados
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <View style={styles.emptyListIconContainer}>
              <Ionicons name="sparkles-outline" size={32} color={theme.dark.primary} />
            </View>
            <Text style={styles.emptyListTitle}>Comece sua timeline!</Text>
            <Text style={styles.emptyListText}>
              Registre o primeiro momento especial do casal
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
              <Text style={styles.modalTitle}>Novo momento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={theme.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="text-outline" size={18} color={theme.dark.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Título do momento"
                placeholderTextColor={theme.dark.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={[styles.inputContainer, styles.inputMultiline]}>
              <Ionicons name="document-text-outline" size={18} color={theme.dark.textMuted} style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput
                style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]}
                placeholder="Descrição (opcional)"
                placeholderTextColor={theme.dark.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={18} color={theme.dark.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Data (YYYY-MM-DD)"
                placeholderTextColor={theme.dark.textMuted}
                value={eventDate}
                onChangeText={setEventDate}
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
  listHeader: {
    marginBottom: theme.spacing.lg,
  },
  listHeaderText: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textSecondary,
    fontWeight: theme.fontWeight.medium,
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
  inputMultiline: {
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
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
