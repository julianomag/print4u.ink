import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { Printer, Menu, X, User, Settings, LogOut, CreditCard, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

export function Header() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const planDetails = profile?.plan_details
  const isFreePlan = planDetails?.planId === 'free'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Printer className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">print4u.ink</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/print-jobs"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Impressões
            </Link>
            <Link
              to="/computers"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Computadores
            </Link>
            <Link
              to="/api-keys"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              API Keys
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Upgrade Plan Button - Only show for free plan */}
            {isFreePlan && (
              <div className="hidden sm:block">
                <Link
                  to="/billing"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-primary hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade
                </Link>
              </div>
            )}

            {/* Plan Badge */}
            {planDetails && (
              <div className="hidden sm:block">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  planDetails.planId === 'free' 
                    ? 'bg-gray-100 text-gray-800' 
                    : planDetails.planId === 'pro' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {planDetails.planId === 'free' ? 'Gratuito' : 
                   planDetails.planId === 'pro' ? 'Pro' : 'Enterprise'}
                </span>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {profile?.company_name || user?.email}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.company_name || 'Empresa'}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Link>
                  
                  <Link
                    to="/billing"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Faturamento
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/print-jobs"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Impressões
              </Link>
              <Link
                to="/computers"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Computadores
              </Link>
              <Link
                to="/api-keys"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                API Keys
              </Link>
              
              {/* Upgrade Plan Button - Mobile */}
              {isFreePlan && (
                <Link
                  to="/billing"
                  className="flex items-center px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade de Plano
                </Link>
              )}
              
              <Link
                to="/settings"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configurações
              </Link>
              <Link
                to="/billing"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Faturamento
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 