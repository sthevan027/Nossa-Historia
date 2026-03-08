# Configuração do Supabase para Vercel

Para o app funcionar corretamente em produção em **https://nossa-historia-nu-inky.vercel.app/**, configure o Supabase:

## 1. Authentication → URL Configuration

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Configure:
   - **Site URL:** `https://nossa-historia-nu-inky.vercel.app`
   - **Redirect URLs:** adicione `https://nossa-historia-nu-inky.vercel.app/**`

## 2. Storage → CORS (se upload falhar)

1. Vá em **Storage** → **Configuration** → **CORS**
2. Adicione a origem: `https://nossa-historia-nu-inky.vercel.app`

Ou use `*` temporariamente para testar (menos seguro).

## 3. Variáveis de ambiente na Vercel

Em **Vercel** → **Project** → **Settings** → **Environment Variables**, confirme:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Depois de alterar, faça um novo deploy para aplicar as mudanças.
