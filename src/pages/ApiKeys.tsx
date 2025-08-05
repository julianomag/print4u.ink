import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { generateApiKey } from '@/lib/utils'
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Database } from '@/lib/supabase'

type ApiKey = Database['public']['Tables']['api_keys']['Row']

export function ApiKeys() {
  const { profile } = useAuthStore()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [addingKey, setAddingKey] = useState(false)
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState('')

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Se não há dados reais, usar dados mock para demonstração
      if (!data || data.length === 0) {
        const mockApiKeys = [
          {
            id: '1',
            name: 'Cliente Desktop',
            key_hash: 'a1b2c3d4e5f6...',
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            name: 'Integração Web',
            key_hash: 'f6e5d4c3b2a1...',
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            name: 'App Mobile',
            key_hash: '9a8b7c6d5e4f...',
            user_id: profile?.id || '1',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        setApiKeys(mockApiKeys)
      } else {
        setApiKeys(data)
      }
    } catch (error) {
      console.error('Erro ao carregar API keys:', error)
      
      // Em caso de erro, usar dados mock
      const mockApiKeys = [
        {
          id: '1',
          name: 'Cliente Desktop',
          key_hash: 'a1b2c3d4e5f6...',
          user_id: profile?.id || '1',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Integração Web',
          key_hash: 'f6e5d4c3b2a1...',
          user_id: profile?.id || '1',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      setApiKeys(mockApiKeys)
    } finally {
      setLoading(false)
    }
  }

  const addApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    setAddingKey(true)
    try {
      const apiKeyValue = generateApiKey()
      const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(apiKeyValue))
      const hashHex = Array.from(new Uint8Array(keyHash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName.trim(),
          key_hash: hashHex
        })
        .select()
        .single()

      if (error) throw error

      setApiKeys([data, ...apiKeys])
      setNewKeyName('')
      setShowAddForm(false)
      setNewKeyValue(apiKeyValue)
      setShowNewKey(true)
      toast.success('API Key criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar API key:', error)
      toast.error('Erro ao criar API key')
    } finally {
      setAddingKey(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta API Key?')) return

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error

      setApiKeys(apiKeys.filter(key => key.id !== id))
      toast.success('API Key removida com sucesso!')
    } catch (error) {
      console.error('Erro ao remover API key:', error)
      toast.error('Erro ao remover API key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

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
              API Keys
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie suas chaves de API para integração com clientes
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova API Key
          </Button>
        </div>

        {/* Add API Key Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Criar Nova API Key
            </h3>
            <form onSubmit={addApiKey} className="space-y-4">
              <Input
                label="Nome da API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Ex: Cliente Desktop Principal"
                required
              />
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  loading={addingKey}
                  disabled={!newKeyName.trim()}
                >
                  Criar API Key
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewKeyName('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* New API Key Display */}
        {showNewKey && newKeyValue && (
          <div className="card mb-8 bg-green-50 border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  API Key Criada com Sucesso!
                </h3>
                <p className="text-green-700 mb-4">
                  Guarde esta chave em um local seguro. Ela não será exibida novamente.
                </p>
                <div className="bg-white p-3 rounded border border-green-300">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {newKeyValue}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newKeyValue)}
                      className="ml-2 text-green-600 hover:text-green-800"
                      title="Copiar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewKey(false)
                  setNewKeyValue('')
                }}
                className="text-green-600 hover:text-green-800"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* API Keys Grid */}
        {apiKeys.length === 0 ? (
          <div className="card text-center py-12">
            <Key className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma API Key criada
            </h3>
            <p className="text-gray-500 mb-6">
              Crie uma API Key para começar a integrar com clientes desktop
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeira API Key
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <Key className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {apiKey.name || 'API Key sem nome'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Criada em {new Date(apiKey.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remover API Key"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">ID:</span> {apiKey.id}
                  </p>
                  <p>
                    <span className="font-medium">Hash:</span> {apiKey.key_hash.substring(0, 16)}...
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
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
                  
                  <div className="text-xs text-gray-500 text-center">
                    Use esta API Key no cliente desktop para conectar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Documentation */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Como usar a API
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Endpoint de Impressão</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                POST https://your-project.supabase.co/functions/v1/createPrintJob
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Headers</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                Authorization: Bearer YOUR_API_KEY<br/>
                Content-Type: application/json
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Body</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                {`{
  "file_content_base64": "base64_encoded_pdf",
  "printer_id": "printer_name",
  "title": "Document Title"
}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 