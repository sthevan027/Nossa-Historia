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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';
import { MemoryCard } from '../components/MemoryCard';
import { SupabaseMemoryRepository } from '../../data/repositories/SupabaseMemoryRepository';
import { SupabaseStorageService } from '../../data/services/SupabaseStorageService';
import type { Memory } from '../../core/types';
import { theme } from '../../shared/theme';

const memoryRepo = new SupabaseMemoryRepository();
const storageService = new SupabaseStorageService();

export function MemoriesScreen() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMemories = async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await memoryRepo.getByCoupleId(couple.id);
      setMemories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [couple?.id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!couple || !user || !title.trim()) {
      Alert.alert('Erro', 'Preencha pelo menos o título');
      return;
    }
    if (!photoUri) {
      Alert.alert('Erro', 'Adicione uma foto');
      return;
    }
    setSaving(true);
    try {
      const path = `memories/${couple.id}/${Date.now()}.jpg`;
      const photoUrl = await storageService.uploadPhoto('photos', path, photoUri);
      await memoryRepo.create({
        couple_id: couple.id,
        title: title.trim(),
        description: description.trim() || undefined,
        photo_url: photoUrl,
        memory_date: memoryDate,
        created_by: user.id,
      });
      setTitle('');
      setDescription('');
      setMemoryDate(new Date().toISOString().split('T')[0]);
      setPhotoUri(null);
      setModalVisible(false);
      await loadMemories();
    } catch (e: unknown) {
      Alert.alert('Erro', (e as Error).message ?? 'Não foi possível adicionar');
    } finally {
      setSaving(false);
    }
  };

  if (!couple) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Conecte seu parceiro para ver as memórias</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemoryCard memory={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma memória ainda. Adicione a primeira!</Text>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMemories} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova memória</Text>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              ) : (
                <Text style={styles.photoButtonText}>📷 Escolher foto</Text>
              )}
            </TouchableOpacity>
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
              value={memoryDate}
              onChangeText={setMemoryDate}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  setModalVisible(false);
                  setPhotoUri(null);
                }}
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
  photoButton: {
    height: 120,
    backgroundColor: theme.dark.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  photoButtonText: {
    color: theme.dark.textSecondary,
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
