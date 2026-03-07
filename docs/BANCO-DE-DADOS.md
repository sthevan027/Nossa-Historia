# Banco de Dados — Nossa História

## Esquema Completo (PostgreSQL / Supabase)

### Tabela: `users`

Gerenciada em grande parte pelo Supabase Auth. Pode ter uma tabela `profiles` para dados adicionais.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK (vem do auth.users) |
| name | text | Nome do usuário |
| email | text | Email (único) |
| avatar_url | text | URL da foto de perfil (opcional) |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

---

### Tabela: `couples`

Relacionamento entre dois usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| user1_id | uuid | FK → users |
| user2_id | uuid | FK → users |
| relationship_start_date | date | Data em que começaram (opcional) |
| invite_code | text | Código de convite (único, temporário) |
| created_at | timestamptz | Data de criação |

**Índices:** `user1_id`, `user2_id`, `invite_code` (único)

---

### Tabela: `timeline_events`

Marcos da linha do tempo do relacionamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| couple_id | uuid | FK → couples |
| title | text | Título do evento |
| description | text | Descrição (opcional) |
| event_date | date | Data do evento |
| photo_url | text | URL da foto (opcional) |
| location | text | Local (opcional) |
| emoji | text | Emoji (opcional) |
| created_by | uuid | FK → users |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

**Índices:** `couple_id`, `event_date` (para ordenação)

---

### Tabela: `memories`

Memórias (álbum compartilhado).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| couple_id | uuid | FK → couples |
| title | text | Título |
| description | text | Descrição |
| photo_url | text | URL da foto |
| memory_date | date | Data da memória |
| location | text | Local (opcional) |
| created_by | uuid | FK → users |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

**Índices:** `couple_id`, `memory_date`

---

### Tabela: `goals`

Metas/planos futuros do casal.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| couple_id | uuid | FK → couples |
| title | text | Título da meta |
| emoji | text | Emoji (opcional) |
| completed | boolean | Se foi realizada |
| completed_at | timestamptz | Quando foi marcada como concluída |
| created_by | uuid | FK → users |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

**Índices:** `couple_id`, `completed`

---

### Tabela: `letters`

Cartas digitais e cápsula do tempo.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| couple_id | uuid | FK → couples |
| title | text | Título da carta |
| message | text | Conteúdo da carta |
| open_date | timestamptz | Data para liberar abertura |
| created_by | uuid | FK → users |
| opened | boolean | Se já foi aberta (opcional) |
| created_at | timestamptz | Data de criação |

**Índices:** `couple_id`, `open_date`

**Nota:** Cápsula do tempo pode usar `type` ('letter' ou 'time_capsule') se precisar diferenciar.

---

### Tabela: `important_dates`

Datas importantes (aniversários, marcos).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| couple_id | uuid | FK → couples |
| title | text | Nome do evento |
| date | date | Data (apenas dia/mês para aniversários) |
| type | text | 'anniversary', 'birthday', 'custom' |
| remind_before_days | int | Dias antes para lembrete |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

**Índices:** `couple_id`, `date`

---

## Diagrama ER (Simplificado)

```
users ──┬──< couples >──┬──< timeline_events
        │               ├──< memories
        │               ├──< goals
        │               ├──< letters
        │               └──< important_dates
```

---

## Row Level Security (RLS)

Políticas sugeridas:

1. **couples:** Usuário só pode ler/escrever se for `user1_id` ou `user2_id`.
2. **timeline_events, memories, goals, letters, important_dates:** Usuário só pode ler/escrever se pertencer ao `couple_id` (via join com `couples`).
