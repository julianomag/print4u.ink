import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { getPlanDetails } from '@/lib/utils'
import { 
  Printer, 
  Monitor, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Download
} from 'lucide-react'
import type { Database } from '@/lib/supabase'

type PrintJob = Database['public']['Tables']['print_jobs']['Row']
type Computer = Database['public']['Tables']['computers']['Row']

export function Dashboard() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({
    totalPrints: 0,
    completedPrints: 0,
    pendingPrints: 0,
    errorPrints: 0,
    onlineComputers: 0,
    totalComputers: 0
  })
  const [recentJobs, setRecentJobs] = useState<PrintJob[]>([])
  const [computers, setComputers] = useState<Computer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const userId = profile?.id
      if (!userId) return

      // Carregar estatísticas
      const { data: printJobs } = await supabase
        .from('print_jobs')
        .select('status')
        .eq('user_id', userId)

      const { data: computersData } = await supabase
        .from('computers')
        .select('*')
        .eq('user_id', userId)

      // Calcular estatísticas
      const totalPrints = printJobs?.length || 0
      const completedPrints = printJobs?.filter(job => job.status === 'completed').length || 0
      const pendingPrints = printJobs?.filter(job => job.status === 'pending').length || 0
      const errorPrints = printJobs?.filter(job => job.status === 'error').length || 0
      const onlineComputers = computersData?.filter(comp => comp.status === 'online').length || 0
      const totalComputers = computersData?.length || 0

      setStats({
        totalPrints,
        completedPrints,
        pendingPrints,
        errorPrints,
        onlineComputers,
        totalComputers
      })

      // Carregar jobs recentes
      const { data: recentJobsData } = await supabase
        .from('print_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentJobs(recentJobsData || [])
      setComputers(computersData || [])
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const planDetails = profile?.plan_details ? getPlanDetails(profile.plan_details.planId) : null
  const usagePercentage = planDetails ? (stats.totalPrints / planDetails.maxPrints) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo de volta, {profile?.company_name || 'Usuário'}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Printer className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Impressões</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrints}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedPrints}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPrints}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Erros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.errorPrints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Usage */}
        {planDetails && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Uso do Plano</h3>
              <span className="text-sm text-gray-500">
                {stats.totalPrints} / {planDetails.maxPrints} impressões
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Plano {planDetails.name}</span>
              <span>{Math.round(usagePercentage)}% usado</span>
            </div>
          </div>
        )}

        {/* Computers Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Computadores</h3>
              <Link
                to="/computers"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {computers.slice(0, 3).map((computer) => (
                <div key={computer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">{computer.computer_name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    computer.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {computer.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
              {computers.length === 0 && (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum computador conectado</p>
                  <Link
                    to="/computers"
                    className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar computador
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Print Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Impressões Recentes</h3>
              <Link
                to="/print-jobs"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    job.status === 'printing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status === 'completed' ? 'Concluída' :
                     job.status === 'pending' ? 'Pendente' :
                     job.status === 'printing' ? 'Imprimindo' : 'Erro'}
                  </span>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma impressão ainda</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Configure um computador para começar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/computers"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Monitor className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Adicionar Computador</p>
                <p className="text-sm text-gray-500">Conecte um novo dispositivo</p>
              </div>
            </Link>
            
            <Link
              to="/api-keys"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Download className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Baixar Cliente</p>
                <p className="text-sm text-gray-500">Instale o software cliente</p>
              </div>
            </Link>
            
            <Link
              to="/billing"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Upgrade do Plano</p>
                <p className="text-sm text-gray-500">Aumente seus limites</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 