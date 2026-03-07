# Branding — Nossa História

## Análise de Alinhamento

### ✅ O que já está alinhado

| Aspecto | Status | Observação |
|---------|--------|------------|
| **Minimalista** | ✅ | DESIGN.md e componentes focam em conteúdo |
| **Mobile-first** | ✅ | Expo/React Native, touch targets, bottom tabs |
| **Fundo escuro** | ✅ | `#0D0D0D` / `#1A1A1A` muito próximo da spec |
| **Surface** | ✅ | `#1A1A1A` igual à spec |
| **Texto branco** | ✅ | `#FFFFFF` |
| **Estrutura de espaçamento** | ✅ | 12, 14, 16, 18, 24, 32 |
| **Border radius** | ✅ | 12–16px para cards |

### ⚠️ Divergências (antes da correção)

| Elemento | Projeto atual | Spec (Branding JSON) |
|----------|---------------|----------------------|
| **Primary** | `#E8B4BC` (rosa pastel) | `#FF4D6D` (rosa vibrante) |
| **Secondary** | ❌ não definido | `#C9184A` |
| **Accent** | ❌ não definido | `#FFD6E0` |
| **Text secondary** | `#A0A0A0` | `#B3B3B3` |
| **Background** | `#0D0D0D` | `#0F0F0F` |
| **Tipografia** | Não explícita (Design sugere Playfair) | **Inter** |

### Conceito visual: duas linhas em coração

A spec define o conceito: *"duas linhas que representam duas vidas se conectando e formando um coração/linha do tempo"*.

- No código atual: uso de emojis (❤️, 📅) como placeholder.
- **Solução:** logos criadas (`nossa-historia-logo.png`, `nossa-historia-icon.png`) com esse conceito.

---

## Paleta de Cores (Branding oficial)

| Uso | Hex |
|-----|-----|
| primary | `#FF4D6D` |
| secondary | `#C9184A` |
| background | `#0F0F0F` |
| surface | `#1A1A1A` |
| text_primary | `#FFFFFF` |
| text_secondary | `#B3B3B3` |
| accent | `#FFD6E0` |

---

## Tipografia

- **Fonte:** Inter
- **Heading:** weight 700
- **Body:** weight 400
- **Button:** weight 600

---

## Assets

- `assets/nossa-historia-logo.png` — Logo para header/splash (ícone + texto)
- `assets/nossa-historia-icon.png` — Ícone do app (coração com timeline em fundo rosa)
