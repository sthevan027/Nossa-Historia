# Arquitetura — Nossa História

## Visão Geral

O app **Nossa História** é um aplicativo mobile-first (React Native + Expo) que usa Supabase como backend (BaaS). A arquitetura é pensada para escalar e manter o código organizado.

**Fluxo básico:**
```
usuário cria conta → conecta parceiro → cria memórias → memórias aparecem para os dois
```

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Expo)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Auth    │ │ Timeline │ │ Memórias │ │  Metas   │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │            │            │            │          │
│       └────────────┴────────────┴────────────┘          │
│                        │                                │
│               Supabase Client SDK                       │
└────────────────────────┬───────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │PostgreSQL│ │ Storage  │ │ Realtime │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Fluxos Principais

### 1. Fluxo de Conexão de Casal

```
User A (logado) → Gera código/link → User B acessa
     → User B faz login/cadastro
     → User B insere código ou clica no link
     → Backend cria registro em couples (user1=A, user2=B)
     → Ambos passam a ver o mesmo "espaço" do casal
```

### 2. Fluxo de Timeline

```
Usuário → Adiciona evento (data, título, foto, etc.)
     → INSERT em timeline_events
     → Realtime notifica o outro parceiro
     → Timeline atualiza em ambos os dispositivos
```

### 3. Fluxo de Memórias

```
Usuário → Seleciona foto + descrição + data
     → Upload para Supabase Storage
     → INSERT em memories (com photo_url)
     → Lista de memórias ordenada por data
```

---

## Segurança e Permissões

- **RLS (Row Level Security):** Usar políticas no PostgreSQL para garantir que:
  - Cada usuário só acesse dados do seu `couple_id`
  - Apenas membros do casal possam criar/editar/deletar registros

- **Storage:** Bucket privado para fotos, com políticas que permitem acesso somente aos usuários do casal.

---

## Considerações de UX Mobile

- Offline-first onde fizer sentido (cache de timeline e memórias)
- Upload em background para fotos
- Gestos: swipe para voltar, pull-to-refresh
- Notificações push para lembretes de datas e cartas

---

## Escalabilidade

- Supabase escala bem para milhares de usuários
- Se necessário no futuro: migrar para backend próprio (Node/Express + PostgreSQL) mantendo a mesma estrutura de dados
