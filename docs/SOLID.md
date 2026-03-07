# Princípios SOLID — Nossa História

Documentação de como os princípios SOLID são aplicados na organização do código.

---

## 1. **S** — Single Responsibility Principle (Responsabilidade Única)

Cada módulo/classe tem uma única razão para mudar.

### Aplicação

- **Services:** Um service por domínio (`authService`, `coupleService`, `timelineService`, `memoryService`)
- **Components:** Componentes com responsabilidade única (`MemoryCard` só exibe memória, `TimelineItem` só exibe evento)
- **Hooks:** Hooks específicos (`useAuth`, `useCouple`, `useTimeline`)

---

## 2. **O** — Open/Closed Principle (Aberto/Fechado)

Aberto para extensão, fechado para modificação.

### Aplicação

- **Repositories:** Interfaces de repositório permitem trocar implementação (Supabase, mock) sem alterar código consumidor
- **Providers:** Context providers extensíveis
- **Tipos:** Tipos e interfaces bem definidos permitem adicionar novas entidades sem quebrar existentes

---

## 3. **L** — Liskov Substitution Principle (Substituição de Liskov)

Objetos de subclasses devem poder substituir objetos da superclasse.

### Aplicação

- **Repositories:** Qualquer implementação de `ITimelineRepository` pode substituir outra
- **Storage:** `SupabaseStorageService` implementa interface `IStorageService` — pode ser trocado por S3, etc.

---

## 4. **I** — Interface Segregation Principle (Segregação de Interface)

Interfaces pequenas e específicas em vez de uma interface "goruda".

### Aplicação

- **Interfaces por domínio:** `IAuthService`, `ICoupleService`, `ITimelineService` — cada uma com métodos específicos
- **Hooks:** `useAuth()` retorna apenas auth; `useCouple()` retorna apenas dados do casal

---

## 5. **D** — Dependency Inversion Principle (Inversão de Dependência)

Depender de abstrações, não de implementações concretas.

### Aplicação

- **Injeção de dependência:** Services recebem clientes Supabase via props/context
- **Repositories:** Screens e hooks dependem de `ITimelineRepository`, não de `SupabaseTimelineRepository`
- **Facilita testes:** Mock de repositórios nos testes

---

## Estrutura de Pastas (SOLID)

```
src/
├── core/                 # Abstrações e contratos
│   ├── interfaces/       # Interfaces (contratos)
│   └── types/            # Tipos compartilhados
├── data/                 # Implementações concretas
│   ├── repositories/     # Implementação dos repositórios
│   └── supabase/         # Cliente e configuração
├── domain/               # Regras de negócio
│   └── services/         # Services que orquestram
├── presentation/         # UI
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   └── navigation/
└── shared/               # Utilitários compartilhados
```

---

## Exemplo de Fluxo SOLID

```
Screen (presentation)
    → usa useTimeline (hook)
        → usa timelineService (domain)
            → usa ITimelineRepository (core/interface)
                → implementado por SupabaseTimelineRepository (data)
```
