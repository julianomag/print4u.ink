import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export function Home() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">print4u.ink</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-orange-600 px-3 py-2 text-sm font-medium">Funcionalidades</a>
              <a href="#pricing" className="text-gray-500 hover:text-orange-600 px-3 py-2 text-sm font-medium">Preços</a>
              <a href="#about" className="text-gray-500 hover:text-orange-600 px-3 py-2 text-sm font-medium">Sobre</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">Entrar</Link>
                  <Link to="/signup" className="btn-primary">Começar Grátis</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Impressão Remota
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Simplificada</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie suas impressões de qualquer lugar. Conecte computadores, monitore jobs e controle custos com nossa plataforma SaaS completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Começar Gratuitamente
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Ver Funcionalidades
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que crescem com você
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para sua empresa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="card">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  R$ 0<span className="text-lg font-normal text-gray-500">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    50 impressões/mês
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    2 computadores
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Suporte por email
                  </li>
                </ul>
                <Link to="/signup" className="btn-secondary w-full">Começar Grátis</Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="card border-2 border-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Mais Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profissional</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  R$ 29<span className="text-lg font-normal text-gray-500">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    500 impressões/mês
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    10 computadores
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Relatórios avançados
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Suporte prioritário
                  </li>
                </ul>
                <Link to="/signup" className="btn-primary w-full">Escolher Pro</Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="card">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresarial</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  R$ 99<span className="text-lg font-normal text-gray-500">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Impressões ilimitadas
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Computadores ilimitados
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    API personalizada
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Suporte 24/7
                  </li>
                </ul>
                <Link to="/signup" className="btn-secondary w-full">Falar com Vendas</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para impressão remota
            </h2>
            <p className="text-xl text-gray-600">
              Uma solução completa para empresas de todos os tamanhos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Controle Total</h3>
              <p className="text-gray-600">Gerencie todos os computadores e impressoras de uma interface centralizada.</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impressão Remota</h3>
              <p className="text-gray-600">Envie documentos para impressão de qualquer lugar, a qualquer momento.</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatórios Detalhados</h3>
              <p className="text-gray-600">Acompanhe uso, custos e performance com relatórios em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sobre o print4u.ink
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplificando a impressão remota para empresas de todos os tamanhos. 
              Nossa missão é tornar a gestão de impressão simples, eficiente e acessível.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold">print4u.ink</span>
              </div>
              <p className="text-gray-400">
                Simplificando a impressão remota para empresas de todos os tamanhos.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Comunidade</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 print4u.ink. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 