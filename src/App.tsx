import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Dashboard } from '@/pages/Dashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy loading para outras páginas
const PrintJobs = React.lazy(() => import('@/pages/PrintJobs').then(module => ({ default: module.PrintJobs })))
const Computers = React.lazy(() => import('@/pages/Computers').then(module => ({ default: module.Computers })))
const ApiKeys = React.lazy(() => import('@/pages/ApiKeys').then(module => ({ default: module.ApiKeys })))
const Settings = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })))
const Billing = React.lazy(() => import('@/pages/Billing').then(module => ({ default: module.Billing })))

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
  return (
    <div className="App">
      <Routes>
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
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
} 