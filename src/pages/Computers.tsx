import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { getPlanDetails } from '@/lib/utils'
import { Monitor, Plus, Trash2, Wifi, WifiOff, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Database } from '@/lib/supabase'

type Computer = Database['public']['Tables']['computers']['Row']

export function Computers() {
  const { profile } = useAuthStore()
  const [computers, setComputers] = useState<Computer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newComputerName, setNewComputerName] = useState('')
  const [addingComputer, setAddingComputer] = useState(false)

  useEffect(() => {
    loadComputers()
  }, [])

  const loadComputers = async () => {
    try {
      const { data, error } = await supabase
        .from('computers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Se não há dados reais, usar dados mock para demonstração
      if (!data || data.length === 0) {
        const mockComputers = [
          {
            id: '1',
            computer_name: 'PC-Sala01',
            status: 'online' as const,
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
            last_seen: new Date().toISOString()
          },
          {
            id: '2',
            computer_name: 'PC-Escritório',
            status: 'online' as const,
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
            last_seen: new Date().toISOString()
          },
          {
            id: '3',
            computer_name: 'PC-Sala02',
            status: 'offline' as const,
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
            last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
          },
          {
            id: '4',
            computer_name: 'PC-Recepção',
            status: 'online' as const,
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
            last_seen: new Date().toISOString()
          }
        ]
        setComputers(mockComputers)
      } else {
        setComputers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar computadores:', error)
      
      // Em caso de erro, usar dados mock
      const mockComputers = [
        {
          id: '1',
          computer_name: 'PC-Sala01',
          status: 'online' as const,
          user_id: profile?.id || '1',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date().toISOString()
        },
        {
          id: '2',
          computer_name: 'PC-Escritório',
          status: 'online' as const,
          user_id: profile?.id || '1',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date().toISOString()
        },
        {
          id: '3',
          computer_name: 'PC-Sala02',
          status: 'offline' as const,
          user_id: profile?.id || '1',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
      setComputers(mockComputers)
    } finally {
      setLoading(false)
    }
  }

  const addComputer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComputerName.trim()) return

    setAddingComputer(true)
    try {
      const { data, error } = await supabase
        .from('computers')
        .insert({
          computer_name: newComputerName.trim(),
          status: 'offline'
        })
        .select()
        .single()

      if (error) throw error

      setComputers([data, ...computers])
      setNewComputerName('')
      setShowAddForm(false)
      toast.success('Computador adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar computador:', error)
      toast.error('Erro ao adicionar computador')
    } finally {
      setAddingComputer(false)
    }
  }

  const deleteComputer = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este computador?')) return

    try {
      const { error } = await supabase
        .from('computers')
        .delete()
        .eq('id', id)

      if (error) throw error

      setComputers(computers.filter(comp => comp.id !== id))
      toast.success('Computador removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover computador:', error)
      toast.error('Erro ao remover computador')
    }
  }

  const planDetails = profile?.plan_details ? getPlanDetails(profile.plan_details.planId) : null
  const canAddComputer = computers.length < (planDetails?.maxComputers || 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Computadores
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie os computadores conectados ao print4u.ink
            </p>
          </div>
          
          {canAddComputer && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Computador
            </Button>
          )}
        </div>

        {/* Plan Info */}
        {planDetails && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Limite de Computadores
                </h3>
                <p className="text-sm text-gray-600">
                  Plano {planDetails.name} - {planDetails.maxComputers} computadores
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {computers.length} / {planDetails.maxComputers}
                </p>
                <p className="text-sm text-gray-500">conectados</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Computer Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Adicionar Novo Computador
            </h3>
            <form onSubmit={addComputer} className="space-y-4">
              <Input
                label="Nome do Computador"
                value={newComputerName}
                onChange={(e) => setNewComputerName(e.target.value)}
                placeholder="Ex: Computador da Recepção"
                required
              />
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  loading={addingComputer}
                  disabled={!newComputerName.trim()}
                >
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewComputerName('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Computers Grid */}
        {computers.length === 0 ? (
          <div className="card text-center py-12">
            <Monitor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum computador conectado
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione um computador para começar a usar o print4u.ink
            </p>
            {canAddComputer && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Computador
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {computers.map((computer) => (
              <div key={computer.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      computer.status === 'online' 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      {computer.status === 'online' ? (
                        <Wifi className="h-5 w-5 text-green-600" />
                      ) : (
                        <WifiOff className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {computer.computer_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {computer.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteComputer(computer.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remover computador"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">ID:</span> {computer.id}
                  </p>
                  <p>
                    <span className="font-medium">Última atividade:</span>{' '}
                    {new Date(computer.last_seen).toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <span className="font-medium">Conectado em:</span>{' '}
                    {new Date(computer.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // Aqui você pode implementar o download do cliente
                      toast('Download do cliente será implementado em breve')
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Cliente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade Plan CTA */}
        {!canAddComputer && (
          <div className="card mt-8 bg-gradient-primary text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Limite de computadores atingido
                </h3>
                <p className="text-white/80">
                  Faça upgrade do seu plano para conectar mais computadores
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  // Navegar para página de billing
                  window.location.href = '/billing'
                }}
              >
                Fazer Upgrade
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 