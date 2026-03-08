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
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCouple } from '../contexts/CoupleContext';
import { MemoryCard } from '../components/MemoryCard';
import { useMemories } from '../hooks/useMemories';
import { theme } from '../../shared/theme';

export function MemoriesScreen() {
  const { couple } = useCouple();
  const { memories, loading, refresh, add } = useMemories();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS !== 'web',
      aspect: Platform.OS === 'web' ? undefined : [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Preencha pelo menos o título');
      return;
    }
    if (!photoUri) {
      Alert.alert('Erro', 'Adicione uma foto');
      return;
    }
    setSaving(true);
    try {
      await add(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          memory_date: memoryDate,
        },
        photoUri,
      );
      setTitle('');
      setDescription('');
      setMemoryDate(new Date().toISOString().split('T')[0]);
      setPhotoUri(null);
      setModalVisible(false);
    } catch (e: unknown) {
      const msg = (e as Error).message ?? 'Não foi possível adicionar';
      console.error('[MemoriesScreen] Erro ao salvar:', e);
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setPhotoUri(null);
  };

  if (!couple) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="images-outline" size={48} color={theme.dark.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Memórias</Text>
        <Text style={styles.emptyText}>Conecte seu parceiro para guardar memórias juntos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemoryCard memory={item} />}
        contentContainerStyle={[
          styles.list,
          memories.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          memories.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {memories.length} {memories.length === 1 ? 'memória guardada' : 'memórias guardadas'}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <View style={styles.emptyListIconContainer}>
              <Ionicons name="heart-outline" size={32} color={theme.dark.primary} />
            </View>
            <Text style={styles.emptyListTitle}>Guarde suas memórias</Text>
            <Text style={styles.emptyListText}>
              Adicione a primeira foto especial do casal
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
          <Ionicons name="camera" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova memória</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={theme.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.photoButton} onPress={pickImage} activeOpacity={0.8}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <View style={styles.photoIconContainer}>
                    <Ionicons name="camera-outline" size={28} color={theme.dark.primary} />
                  </View>
                  <Text style={styles.photoPlaceholderText}>Toque para escolher uma foto</Text>
                </View>
              )}
              {photoUri && (
                <View style={styles.photoOverlay}>
                  <View style={styles.photoEditBadge}>
                    <Ionicons name="pencil" size={14} color="#FFF" />
                  </View>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Ionicons name="text-outline" size={18} color={theme.dark.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Título da memória"
                placeholderTextColor={theme.dark.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={[styles.inputContainer, styles.inputMultiline]}>
              <Ionicons name="document-text-outline" size={18} color={theme.dark.textMuted} style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
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
                value={memoryDate}
                onChangeText={setMemoryDate}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
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
    marginBottom: theme.spacing.md,
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
    maxHeight: '90%',
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
  photoButton: {
    height: 160,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.dark.border,
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: theme.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  photoIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: theme.dark.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  photoEditBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.dark.primary,
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
