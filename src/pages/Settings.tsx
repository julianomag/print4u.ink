import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { User, Building, Mail, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export function Settings() {
  const { profile, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || '',
    email: profile?.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await updateProfile({
        company_name: formData.company_name
      })

      if (error) {
        toast.error('Erro ao atualizar perfil')
      } else {
        toast.success('Perfil atualizado com sucesso!')
      }
    } catch (error) {
      toast.error('Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configurações
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <a
                href="#profile"
                className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md"
              >
                <User className="h-5 w-5 mr-3" />
                Perfil
              </a>
              <a
                href="#security"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <Mail className="h-5 w-5 mr-3" />
                Segurança
              </a>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <div id="profile" className="card">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Informações da Empresa
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nome da Empresa"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Nome da sua empresa"
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                  helperText="O email não pode ser alterado"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex items-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </div>

            {/* Account Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informações da Conta
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID da Conta</p>
                    <p className="text-sm text-gray-500">Identificador único da sua conta</p>
                  </div>
                  <code className="text-sm text-gray-600 font-mono">
                    {profile?.id?.substring(0, 8)}...
                  </code>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Plano Atual</p>
                    <p className="text-sm text-gray-500">Seu plano de assinatura</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {profile?.plan_details?.planId === 'free' ? 'Gratuito' : 
                     profile?.plan_details?.planId === 'pro' ? 'Pro' : 'Enterprise'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Membro desde</p>
                    <p className="text-sm text-gray-500">Data de criação da conta</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Última Atualização</p>
                    <p className="text-sm text-gray-500">Última modificação no perfil</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200 bg-red-50">
              <h2 className="text-xl font-semibold text-red-900 mb-6">
                Zona de Perigo
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">Excluir Conta</p>
                    <p className="text-sm text-red-700">
                      Excluir permanentemente sua conta e todos os dados
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
                        toast.error('Funcionalidade de exclusão será implementada em breve')
                      }
                    }}
                  >
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 