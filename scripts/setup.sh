#!/bin/bash

echo "🚀 Configurando print4u.ink..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp env.example .env.local
    echo "⚠️  IMPORTANTE: Configure suas variáveis de ambiente no arquivo .env.local"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
fi

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI não está instalado."
    echo "   Para instalar: npm install -g supabase"
    echo "   Para fazer login: supabase login"
    echo "   Para deploy das funções: supabase functions deploy"
else
    echo "✅ Supabase CLI encontrado"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure suas variáveis de ambiente em .env.local"
echo "2. Execute o script SQL em supabase/schema.sql no Supabase Dashboard"
echo "3. Configure autenticação e storage no Supabase Dashboard"
echo "4. Deploy das Edge Functions: supabase functions deploy"
echo "5. Execute: npm run dev"
echo ""
echo "📚 Documentação: README.md"
echo "🌐 Supabase: https://supabase.com"
echo "" 