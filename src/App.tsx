import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Dashboard } from '@/pages/Dashboard'
import { Home } from '@/pages/Home'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy loading para outras páginas
const PrintJobs = React.lazy(() => import('@/pages/PrintJobs').then(module => ({ default: module.PrintJobs })))
const Computers = React.lazy(() => import('@/pages/Computers').then(module => ({ default: module.Computers })))
const ApiKeys = React.lazy(() => import('@/pages/ApiKeys').then(module => ({ default: module.ApiKeys })))
const Settings = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })))
const Billing = React.lazy(() => import('@/pages/Billing').then(module => ({ default: module.Billing })))

// Componente para página inicial quando Supabase não está configurado
function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            print4u.ink
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            SaaS de Impressão Remota
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuração Necessária
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Para usar todas as funcionalidades, você precisa configurar o Supabase.
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xs font-medium">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Criar conta no Supabase</p>
                  <p className="text-sm text-gray-600">Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500">supabase.com</a></p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xs font-medium">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Configurar variáveis</p>
                  <p className="text-sm text-gray-600">Copie <code className="bg-gray-100 px-1 rounded">env.example</code> para <code className="bg-gray-100 px-1 rounded">.env</code></p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xs font-medium">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Executar schema SQL</p>
                  <p className="text-sm text-gray-600">Execute o conteúdo de <code className="bg-gray-100 px-1 rounded">supabase/schema.sql</code></p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://github.com/julianomag/print4u.ink#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                Ver Documentação Completa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para processar o callback do OAuth
function AuthCallback() {
  const { loading } = useAuthStore()
  
  React.useEffect(() => {
    // O Supabase automaticamente processa o callback e atualiza o estado
    // Não precisamos fazer nada aqui, apenas aguardar
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Processando login...</p>
        </div>
      </div>
    )
  }

  // Se não estiver carregando, redirecionar para o dashboard
  return <Navigate to="/dashboard" replace />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  const { loading } = useAuthStore()
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  // Se não estiver carregando e o Supabase não estiver configurado, mostrar página de setup
  if (!loading && !isSupabaseConfigured) {
    return <SetupPage />
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <LoginForm />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignupForm />
          </AuthRoute>
        } />
        
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/print-jobs" element={
          <ProtectedRoute>
            <React.Suspense fallback={<LoadingSpinner />}>
              <PrintJobs />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/computers" element={
          <ProtectedRoute>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Computers />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/api-keys" element={
          <ProtectedRoute>
            <React.Suspense fallback={<LoadingSpinner />}>
              <ApiKeys />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Billing />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        {/* Default redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
} 