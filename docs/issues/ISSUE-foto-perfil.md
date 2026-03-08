# Implementar foto de perfil do usuário

## Descrição

Permitir que o usuário adicione, altere e visualize uma foto de perfil na tela de perfil e em outros pontos do app onde a identidade visual do usuário é exibida.

## Contexto atual

Atualmente a tela de perfil (`ProfileScreen`) exibe apenas a inicial do nome do usuário em um avatar circular. O mesmo acontece com o avatar do parceiro quando conectado.

```tsx
// ProfileScreen.tsx - avatar atual
<View style={styles.avatar}>
  <Text style={styles.avatarText}>
    {user?.name?.charAt(0).toUpperCase() ?? '?'}
  </Text>
</View>
```

## Tarefas sugeridas

- [ ] Criar/atualizar modelo de dados para armazenar URL da foto de perfil (Supabase Storage)
- [ ] Implementar upload de imagem (câmera e/ou galeria) usando `expo-image-picker`
- [ ] Exibir foto no avatar quando disponível; fallback para inicial do nome quando não houver foto
- [ ] Permitir troca/remoção da foto de perfil
- [ ] Exibir foto de perfil do parceiro quando disponível
- [ ] Considerar otimização (thumbnails, cache) para performance

## Critérios de aceite

- Usuário consegue tirar foto ou escolher da galeria
- Foto é exibida corretamente no avatar da tela de perfil
- Usuário pode trocar ou remover a foto
- Avatar do parceiro também exibe foto quando configurada
- Fallback gracioso quando não há foto (inicial do nome)

## Arquivos relevantes

- `app/presentation/screens/ProfileScreen.tsx` — avatar atual
- `app/data/services/SupabaseStorageService.ts` — serviço de storage
- Modelo de usuário/casal (perfil Supabase ou tabela `profiles`)

## Labels sugeridas

`enhancement` `feature`

---

**Para criar a issue no GitHub:** copie o título e o conteúdo acima e crie uma nova issue em https://github.com/sthevan027/Nossa-Historia/issues/new
