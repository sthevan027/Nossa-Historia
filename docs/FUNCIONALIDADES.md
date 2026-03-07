# Funcionalidades — Nossa História

Documentação detalhada de cada funcionalidade do app.

---

## 1. Sistema de Contas

### Cadastro
- Nome, email, senha
- Validação de email único
- Confirmação de email (opcional, via Supabase)

### Login
- Email + senha
- Persistência de sessão
- Recuperação de senha

### Conexão de Parceiro(a)
- **Gerar código:** 6 caracteres alfanuméricos (ex: `A8F2K9`)
- **Gerar link:** `nossahistoria.app/invite/[código]`
- **Aceitar convite:**
  - Parceiro acessa link ou digita código
  - Se não tiver conta: cadastro → depois aceita
  - Se já tiver conta: login → aceita
- Após aceitar: cria `couples` e associa os dois usuários
- Código/link expira em 24–48h (configurável)

### Estados
- **Sem parceiro:** tela “Conectar parceiro(a)” em destaque
- **Com parceiro:** exibe nome e avatar do outro, dados compartilhados

---

## 2. Linha do Tempo

### O que é
Timeline vertical com os principais marcos do relacionamento.

### Ações
- **Adicionar evento:** data, título, descrição, foto, local, emoji
- **Editar evento:** quem criou ou ambos (configurável)
- **Deletar evento:** com confirmação
- **Ordenar:** por data (mais recente ou mais antigo primeiro)

### Exibição
- Agrupado por ano
- Cada evento: ícone, data, título, thumb da foto
- Toque abre detalhe (foto grande, texto, local)

### Permissões
- Apenas membros do casal veem e editam

---

## 3. Memórias

### O que é
Álbum de fotos e histórias compartilhadas.

### Ações
- **Adicionar memória:** foto(s), título, descrição, localização, data
- **Editar/Deletar:** com confirmação
- **Ver em galeria:** grid de fotos
- **Ver em lista:** data, título, preview

### Storage
- Fotos em Supabase Storage
- Resize/compressão antes do upload (mobile)
- Thumbnails para listagem

---

## 4. Planos Futuros (Metas)

### O que é
Lista de metas/sonhos do casal com checkbox de conclusão.

### Ações
- **Adicionar meta:** título, emoji opcional
- **Marcar como concluída:** muda estado e data
- **Desmarcar:** volta para “a fazer”
- **Editar/Deletar:** com confirmação

### Exibição
- Lista com checkbox
- Filtros: Todas | Pendentes | Concluídas
- Contador: “X de Y realizadas”

---

## 5. Datas Importantes

### O que é
Calendário de datas especiais com lembretes e contador.

### Ações
- **Adicionar data:** título, data, tipo (aniversário, custom, etc.)
- **Contador de dias juntos:** baseado em `relationship_start_date`
- **Próximo aniversário:** dias restantes
- **Lembretes:** push X dias antes

### Datas padrão (sugestão)
- Início do relacionamento
- Aniversário de namoro
- Aniversário do parceiro(a)
- Primeiro encontro (pode vir da timeline)

---

## 6. Cartas Digitais

### O que é
Mensagens que só podem ser abertas em uma data/hora definida.

### Ações
- **Escrever carta:** título, mensagem, data de abertura
- **Tipos de abertura:**
  - Em X ano(s)
  - No aniversário de namoro
  - Em data específica
- **Abrir:** quando `open_at` for alcançado
- **Indicador:** “Carta disponível” ou “Disponível em DD/MM/AAAA”

### Regras
- Não é possível editar depois de enviada
- Só o autor vê até abrir (ou ambos, dependendo da regra)

---

## 7. Cápsula do Tempo

### O que é
Caso especial de carta: abre em 1, 3 ou 5 anos.

### Ações
- **Criar cápsula:** escolher 1, 3 ou 5 anos
- **Conteúdo:** texto (e possivelmente mídia)
- **Abertura automática:** no dia exato, a cápsula fica disponível
- **Notificação:** avisar quando a cápsula estiver pronta

---

## Tela Inicial (Dashboard)

### Métricas exibidas
- **Dias juntos:** `relationship_start_date` até hoje
- **Memórias criadas:** count de `memories`
- **Eventos na timeline:** count de `timeline_events`
- **Planos realizados:** count de `goals` onde `completed = true`

### Navegação (Bottom Tabs)
- **Home** — Dashboard com resumo
- **Timeline** — Linha do tempo
- **Memórias** — Álbum compartilhado
- **Planos** — Metas do casal
- **Perfil** — Configurações e dados do usuário
- Avatar + nome do parceiro no topo
- Tema claro/escuro (se implementado)
