import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCouple } from '../contexts/CoupleContext';
import { theme } from '../../shared/theme';
import { repositories } from '../../data/repositories';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  iconColor?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, sublabel, iconColor, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? theme.dark.error : (iconColor ?? theme.dark.primary)}
        />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.dark.textMuted} />
    </TouchableOpacity>
  );
}

function Avatar({
  uri,
  initial,
  size = 72,
  style,
}: {
  uri?: string | null;
  initial: string;
  size?: number;
  style?: object;
}) {
  const s = size;
  const radius = s / 2;
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: s,
            height: s,
            borderRadius: radius,
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.3)',
          },
          style,
        ]}
      />
    );
  }
  return (
    <View
      style={[
        styles.avatar,
        { width: s, height: s, borderRadius: radius },
        style,
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: s * 0.4 }]}>{initial}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { user, signOut, refreshUser } = useAuth();
  const { couple, partner, refresh } = useCouple();
  const [uploading, setUploading] = useState(false);

  const handleChangePhoto = () => {
    Alert.alert('Foto de perfil', 'Escolha uma opção', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tirar foto', onPress: handleTakePhoto },
      { text: 'Escolher da galeria', onPress: handlePickFromGallery },
      ...(user?.avatar_url
        ? [{ text: 'Remover foto', style: 'destructive' as const, onPress: handleRemovePhoto }]
        : []),
    ]);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS !== 'web',
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && user) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS !== 'web',
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && user) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.avatar_url) return;
    Alert.alert('Remover foto', 'Deseja remover sua foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          setUploading(true);
          try {
            await repositories.auth.updateAvatarUrl(user.id, null);
            await refreshUser();
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível remover a foto.');
          } finally {
            setUploading(false);
          }
        },
      },
    ]);
  };

  const uploadAvatar = async (uri: string) => {
    if (!user) return;
    setUploading(true);
    try {
      const path = `avatars/${user.id}/avatar.jpg`;
      const url = await repositories.storage.uploadPhoto('photos', path, uri);
      await repositories.auth.updateAvatarUrl(user.id, url);
      await refreshUser();
      await refresh();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar a foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[...theme.dark.gradient.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerDecoration}>
          <Ionicons name="heart" size={180} color="rgba(255,255,255,0.06)" />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={handleChangePhoto}
              disabled={uploading}
              activeOpacity={0.8}
              style={styles.avatarTouchable}
            >
              {uploading ? (
                <View style={[styles.avatar, styles.avatarLoading]}>
                  <ActivityIndicator color="#FFF" size="small" />
                </View>
              ) : (
                <Avatar
                  uri={user?.avatar_url}
                  initial={user?.name?.charAt(0).toUpperCase() ?? '?'}
                />
              )}
            </TouchableOpacity>
            {partner && (
              <Avatar
                uri={partner.avatar_url}
                initial={partner.name?.charAt(0).toUpperCase() ?? '?'}
                style={styles.partnerAvatar}
              />
            )}
          </View>
          <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {partner && (
            <View style={styles.partnerBadge}>
              <Ionicons name="heart" size={12} color={theme.dark.primary} />
              <Text style={styles.partnerBadgeText}>
                Conectado com {partner.name}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Conta</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label={user?.name ?? 'Usuário'}
            sublabel="Seu perfil"
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="mail-outline"
            label={user?.email ?? ''}
            sublabel="Email da conta"
          />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Relacionamento</Text>
        <View style={styles.menuCard}>
          {partner ? (
            <MenuItem
              icon="heart-outline"
              label={partner.name}
              sublabel="Seu parceiro(a)"
              iconColor={theme.dark.primary}
            />
          ) : (
            <MenuItem
              icon="person-add-outline"
              label="Convidar parceiro"
              sublabel="Gere um código e envie para conectar"
              iconColor={theme.dark.primary}
              onPress={() => navigation.getParent()?.navigate('ConnectPartner')}
            />
          )}
          {couple?.relationship_start_date && (
            <>
              <View style={styles.menuDivider} />
              <MenuItem
                icon="calendar-outline"
                label="Início do relacionamento"
                sublabel={new Date(couple.relationship_start_date).toLocaleDateString('pt-BR')}
                iconColor={theme.dark.warning}
              />
            </>
          )}
        </View>
      </View>

      <View style={styles.menuSection}>
        <View style={styles.menuCard}>
          <MenuItem
            icon="log-out-outline"
            label="Sair da conta"
            danger
            onPress={handleSignOut}
          />
        </View>
      </View>

      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Nossa História v1.0.0</Text>
        <Text style={styles.versionSubtext}>Feito com ❤️ para casais</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    right: -40,
    top: -20,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarTouchable: {
    marginRight: -16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarLoading: {
    borderWidth: 0,
  },
  partnerAvatar: {
    marginLeft: -16,
  },
  avatarText: {
    fontSize: theme.fontSize.xxl,
    color: '#FFF',
    fontWeight: theme.fontWeight.bold,
  },
  name: {
    fontSize: theme.fontSize.xl,
    color: '#FFF',
    fontWeight: theme.fontWeight.bold,
  },
  email: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  partnerBadgeText: {
    fontSize: theme.fontSize.xs,
    color: '#FFF',
    fontWeight: theme.fontWeight.medium,
  },
  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  menuSectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textMuted,
    fontWeight: theme.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  menuCard: {
    backgroundColor: theme.dark.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.dark.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.dark.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuIconDanger: {
    backgroundColor: theme.dark.error + '18',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: theme.fontSize.md,
    color: theme.dark.text,
    fontWeight: theme.fontWeight.medium,
  },
  menuLabelDanger: {
    color: theme.dark.error,
  },
  menuSublabel: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textSecondary,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.dark.border,
    marginLeft: 68,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  versionText: {
    fontSize: theme.fontSize.sm,
    color: theme.dark.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  versionSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.dark.textMuted,
    marginTop: theme.spacing.xs,
  },
});
