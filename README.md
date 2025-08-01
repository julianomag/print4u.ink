# print4u.ink - SaaS de Impressão Remota

Uma plataforma SaaS moderna para impressão remota, construída com React, TypeScript, Supabase e Tailwind CSS.

## 🚀 Características

- **Autenticação Segura**: Login com email/senha e Google OAuth
- **Dashboard Intuitivo**: Visão geral de impressões, computadores e uso do plano
- **API RESTful**: Endpoints para integração com clientes desktop
- **Sistema de Planos**: Gratuito, Pro e Enterprise com limites configuráveis
- **Armazenamento de Arquivos**: Upload seguro de PDFs via Supabase Storage
- **Interface Responsiva**: Design moderno e adaptável para todos os dispositivos
- **Row Level Security**: Segurança em nível de linha no banco de dados

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Zustand** para gerenciamento de estado
- **Lucide React** para ícones

### Backend
- **Supabase** como backend unificado
- **PostgreSQL** como banco de dados
- **Supabase Auth** para autenticação
- **Supabase Storage** para arquivos
- **Edge Functions** para lógica serverless

### Integrações
- **Stripe** para pagamentos (opcional)
- **Google OAuth** para login social

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (gratuita)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/print4u.ink.git
cd print4u.ink
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Execute o script SQL em `supabase/schema.sql` no SQL Editor
   - Configure autenticação com Google OAuth (opcional)

4. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_do_stripe
```

5. **Configure o Storage do Supabase**
   - Crie um bucket chamado `print-files`
   - Configure as políticas de acesso para permitir upload/download

6. **Deploy das Edge Functions**
```bash
# Instale o CLI do Supabase
npm install -g supabase

# Login no Supabase
supabase login

# Deploy das funções
supabase functions deploy createPrintJob
supabase functions deploy resetMonthlyCount
```

7. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
print4u.ink/
├── src/
│   ├── components/
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── layout/         # Layout e navegação
│   │   └── ui/             # Componentes reutilizáveis
│   ├── lib/                # Utilitários e configurações
│   ├── pages/              # Páginas da aplicação
│   ├── store/              # Gerenciamento de estado (Zustand)
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Ponto de entrada
├── supabase/
│   ├── functions/          # Edge Functions
│   └── schema.sql          # Schema do banco
├── public/                 # Arquivos estáticos
└── package.json
```

## 🔧 Configuração do Supabase

### 1. Schema do Banco de Dados

Execute o script `supabase/schema.sql` no SQL Editor do Supabase. Este script cria:

- Tabelas: `users`, `computers`, `print_jobs`, `api_keys`
- Políticas de segurança (RLS)
- Funções para gerenciar usuários e contadores
- Índices para performance

### 2. Autenticação

No Supabase Dashboard:
1. Vá para Authentication > Settings
2. Configure os provedores desejados (Email, Google)
3. Configure as URLs de redirecionamento

### 3. Storage

1. Crie um bucket chamado `print-files`
2. Configure as políticas de acesso:

```sql
-- Permitir upload para usuários autenticados
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'print-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permitir download para usuários autenticados
CREATE POLICY "Users can download files" ON storage.objects
FOR SELECT USING (bucket_id = 'print-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🔌 API Endpoints

### Criar Job de Impressão
```http
POST /functions/v1/createPrintJob
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "file_content_base64": "base64_encoded_pdf",
  "printer_id": "printer_name",
  "title": "Document Title"
}
```

### Reset Mensal (Cron)
```http
POST /functions/v1/resetMonthlyCount
```

## 💳 Planos e Preços

| Plano | Impressões/Mês | Computadores | Preço |
|-------|----------------|--------------|-------|
| Gratuito | 20 | 1 | R$ 0 |
| Pro | 500 | 5 | R$ 29,90 |
| Enterprise | 2000 | 20 | R$ 99,90 |

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`

## 🔒 Segurança

- **Row Level Security (RLS)** no PostgreSQL
- **API Keys** com hash SHA-256
- **Autenticação JWT** via Supabase
- **CORS** configurado nas Edge Functions
- **Validação** de entrada em todos os endpoints

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Documentação**: [docs.print4u.ink](https://docs.print4u.ink)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/print4u.ink/issues)
- **Email**: suporte@print4u.ink

## 🎯 Roadmap

- [ ] Cliente desktop Electron
- [ ] Integração com Stripe
- [ ] Relatórios avançados
- [ ] API REST completa
- [ ] Webhooks para notificações
- [ ] Suporte a múltiplos idiomas
- [ ] App mobile React Native

---

**Desenvolvido com ❤️ pela equipe print4u.ink** 