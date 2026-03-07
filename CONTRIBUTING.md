# Contribuindo — Nossa História

Obrigado pelo interesse em contribuir! Este documento traz orientações para manter o projeto consistente.

---

## Desenvolvimento Local

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Conta Supabase (para backend)

### Setup

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase

# Iniciar o app
pnpm start
```

---

## Convenções de Código

### SOLID

Siga os princípios SOLID documentados em [docs/SOLID.md](./docs/SOLID.md).

### Estilo

- Use **TypeScript** para tipo de segurança
- **ESLint** e **Prettier** configurados — rode `pnpm lint` antes de commitar
- Componentes em PascalCase, arquivos em camelCase

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

Exemplo: `feat(timeline): adiciona filtro por ano`

---

## Estrutura do Projeto

```
app/
├── core/           # Interfaces e tipos
├── data/           # Repositórios e Supabase
├── domain/         # Services
├── presentation/   # Screens, components, hooks
└── shared/         # Utilitários
```

---

## Testes

```bash
pnpm test
```

---

## Pull Requests

1. Crie uma branch: `git checkout -b feat/minha-feature`
2. Faça commits com mensagens descritivas
3. Envie o PR para `main`
4. Aguarde a revisão
