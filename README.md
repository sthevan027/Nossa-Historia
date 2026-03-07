# Nossa História

> Um aplicativo para casais registrarem e construírem sua história juntos — como um sistema operacional do relacionamento.

**Repositório:** [github.com/sthevan027/Nossa-Historia](https://github.com/sthevan027/Nossa-Historia)

---

## 🚀 Setup Rápido

```bash
pnpm install
cp .env.example .env
# Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env
pnpm start
```

**Supabase:** Execute o SQL em `supabase/migrations/001_initial_schema.sql` no SQL Editor do seu projeto. Depois, crie o bucket `photos` em Storage (público) para upload de memórias.

---

## 📱 Conceito do App

**Nossa História** não é só memória. É um espaço onde duas pessoas conectam suas contas e constroem juntos:

- **Linha do tempo** do relacionamento  
- **Memórias** compartilhadas  
- **Metas do casal**  
- **Planos futuros**  
- **Cartas digitais** e **cápsula do tempo**  
- **Contador de dias** juntos  

Algo como *Notion + Timeline + diário de casal*, focado em mobile-first.

---

## 🎯 Funcionalidades Principais

### 1. Sistema de Contas

- Cada pessoa cria sua conta (cadastro/login)
- **Conectar parceiro(a)** via código ou link
- Fluxo:
  1. Você cria conta
  2. Gera um código (ex: `A8F2K`) ou link (ex: `nossahistoria.app/invite/AB123`)
  3. Parceiro(a) entra no link ou digita o código
  4. Contas ficam conectadas

**Exemplo visual:**
```
Conectar parceiro(a)

Código: A8F2K
ou
Enviar convite

Depois de conectado:
Sthevan ❤️ [Nome do parceiro]
```

---

### 2. Linha do Tempo do Relacionamento

Tela principal — timeline visual com os marcos da história do casal.

**Exemplo:**
```
2026
│
├── Primeira vez que conversamos
├── Primeiro encontro
├── Primeiro beijo
├── Primeira foto juntos
└── Nossa primeira viagem
```

**Cada evento pode ter:**
- Foto
- Texto
- Localização
- Emoji

---

### 3. Memórias

Álbum compartilhado de fotos e histórias.

**Exemplo de memória:**
| Memória       | Foto | Data     | Descrição         |
|---------------|------|----------|-------------------|
| 📍 Academia   | 🖼️  | 02/03/26 | Primeira foto juntos |

**Recursos:**
- Adicionar fotos
- Escrever histórias
- Comentar

---

### 4. Planos Futuros (Metas do Casal)

Lista de sonhos e objetivos que vocês podem marcar como realizados.

**Exemplo:**
```
☐ 🌎 Viajar juntos
☐ 🏡 Morar juntos
☐ 🐶 Ter um cachorro
☐ ✈️ Conhecer outro país
☑ Abrir algo juntos
```

---

### 5. Datas Importantes (Calendário)

Datas especiais com lembretes e contador.

**Exemplo:**
```
Dias juntos: 127
Próximo aniversário de namoro: em 12 dias
```

**Eventos:**
- Aniversário de namoro
- Aniversário do parceiro(a)
- Dia que começaram
- Primeira viagem
- Outros marcos

---

### 6. Cartas Digitais

Mensagens escritas para abrir em momentos especiais.

**Exemplo:**
- Carta para abrir em 1 ano  
- Carta para abrir no aniversário  
- Carta para abrir quando estivermos longe  

---

### 7. Cápsula do Tempo

Vocês escrevem algo hoje. O app só libera em:

- 1 ano
- 3 anos
- 5 anos

---

## 🏠 Tela Inicial

Resumo do relacionamento e acesso rápido às seções.

```
❤️ Vocês dois

Dias juntos: 34

Memórias: 12  |  Eventos: 6  |  Planos: 4

[Linha do tempo]  [Memórias]  [Planos]  [Cartas]
```

---

## 💻 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React Native + Expo |
| **Backend** | Supabase |
| **Banco** | PostgreSQL (via Supabase) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime |

**Vantagens:**
- React familiar
- Desenvolvimento rápido
- Android e iOS com um código
- Auth, banco, storage e realtime em uma stack

---

## 🗄️ Estrutura do Banco de Dados

### `users`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| name | string |
| email | string |

### `couples`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| user1_id | uuid (FK → users) |
| user2_id | uuid (FK → users) |
| created_at | timestamp |
| invite_code | string |

### `memories`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| couple_id | uuid (FK → couples) |
| title | string |
| description | text |
| photo_url | string |
| location | string (opcional) |
| date | date |
| created_by | uuid (FK → users) |

### `timeline_events`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| couple_id | uuid (FK → couples) |
| event | string |
| date | date |
| photo_url | string (opcional) |
| location | string (opcional) |
| emoji | string (opcional) |

### `goals`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| couple_id | uuid (FK → couples) |
| title | string |
| completed | boolean |
| completed_at | timestamp (opcional) |

### `letters`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| couple_id | uuid (FK → couples) |
| title | string |
| message | text |
| open_date | timestamp (data para abrir) |
| created_by | uuid (FK → users) |

### `important_dates`
| Campo | Tipo |
|-------|------|
| id | uuid (PK) |
| couple_id | uuid (FK → couples) |
| title | string |
| date | date |
| type | enum (anniversary, birthday, custom) |

---

## 🎨 Design

**Estilo:**
- Minimalista  
- Moderno  
- Emocional  

**Paleta sugerida:**
- **Opção 1:** preto + rosa + branco (minimalista, clean)  
- **Opção 2:** bege + creme + dourado (elegante)  

**Temas:** dark/light  

---

## 🚀 Roadmap

1. **MVP (primeira versão)**
   - Login
   - Conectar parceiro (código/link)
   - Linha do tempo
   - Memórias com foto

2. **v1.1**
   - Planos/Metas
   - Datas importantes + contador de dias
   - Cartas digitais
   - Cápsula do tempo

3. **Futuro**
   - Chat do casal, mapa de memórias, vídeo timeline
   - Timeline como “documentário” do relacionamento
   - Possível expansão como produto/startup

---

## 📁 Estrutura do Projeto

```
nossa-historia/
├── app/
│   ├── components/
│   │   ├── MemoryCard
│   │   ├── TimelineItem
│   │   └── CoupleHeader
│   ├── screens/
│   │   ├── LoginScreen
│   │   ├── RegisterScreen
│   │   ├── HomeScreen
│   │   ├── TimelineScreen
│   │   ├── MemoriesScreen
│   │   ├── GoalsScreen
│   │   └── LettersScreen
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   └── memoryService.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── App.js
├── assets/
├── README.md
└── package.json
```

### Navegação (Bottom Tabs)

| Tab | Tela |
|-----|------|
| Home | Dashboard com resumo do relacionamento |
| Timeline | Linha do tempo |
| Memórias | Álbum compartilhado |
| Planos | Metas do casal |
| Perfil | Configurações e dados do usuário |

---

## 📄 Licença

Projeto pessoal — Nossa História.
