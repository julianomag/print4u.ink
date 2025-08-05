# 🚀 Guia de Deploy - print4u.ink

## Opções para Compartilhar o SaaS

### 1. **Vercel (Recomendado - Mais Fácil)**

#### Pré-requisitos:
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)

#### Passos:

1. **Configurar Supabase:**
   ```bash
   # Criar projeto no Supabase
   # Copiar URL e ANON KEY
   ```

2. **Deploy no Vercel:**
   ```bash
   # Instalar Vercel CLI
   npm install -g vercel
   
   # Fazer login
   vercel login
   
   # Deploy
   vercel
   ```

3. **Configurar Variáveis de Ambiente:**
   - Vá para o dashboard do Vercel
   - Settings > Environment Variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_STRIPE_PUBLISHABLE_KEY` (opcional)

4. **URL será gerada automaticamente:**
   ```
   https://print4u-ink-xxxx.vercel.app
   ```

### 2. **Netlify (Alternativa)**

#### Passos:
1. Conecte seu repositório GitHub
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configure variáveis de ambiente
4. Deploy automático

### 3. **GitHub Pages (Gratuito)**

#### Passos:
1. Adicione no `package.json`:
   ```json
   {
     "homepage": "https://seuusuario.github.io/print4u.ink",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. Instale e deploy:
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

### 4. **Railway (Alternativa)**

#### Passos:
1. Conecte GitHub
2. Configure variáveis de ambiente
3. Deploy automático

## 🔧 Configuração do Supabase

### 1. Criar Projeto:
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote URL e ANON KEY

### 2. Executar Schema:
1. Vá para SQL Editor
2. Execute o conteúdo de `supabase/schema.sql`

### 3. Configurar Auth:
1. Authentication > Settings
2. Configure Site URL
3. Adicione redirect URLs

## 📱 Compartilhamento

### URL Pública:
Após o deploy, você terá uma URL como:
```
https://print4u-ink.vercel.app
```

### Funcionalidades Disponíveis:
- ✅ Login/Cadastro
- ✅ Dashboard com mock data
- ✅ Gerenciamento de computadores
- ✅ Histórico de impressões
- ✅ API Keys
- ✅ Responsivo (mobile/desktop)

## 🔒 Segurança

### Variáveis de Ambiente:
- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `VITE_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe (opcional)

### Recomendações:
- Use HTTPS sempre
- Configure CORS no Supabase
- Monitore logs de acesso

## 🚀 Deploy Rápido (Vercel)

```bash
# 1. Instalar Vercel
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configurar variáveis no dashboard
# 5. Compartilhar URL
```

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no Vercel
2. Teste localmente primeiro
3. Verifique configuração do Supabase
4. Consulte a documentação do Vercel 