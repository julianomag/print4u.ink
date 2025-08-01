import React from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getPlanDetails } from '@/lib/utils'
import { Check, Star, CreditCard, Zap } from 'lucide-react'

export function Billing() {
  const { profile } = useAuthStore()
  const currentPlan = profile?.plan_details?.planId || 'free'
  const currentPlanDetails = getPlanDetails(currentPlan)

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      maxPrints: 20,
      maxComputers: 1,
      features: [
        '20 impressões/mês',
        '1 computador',
        'Suporte básico',
        'API básica'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 29.90,
      maxPrints: 500,
      maxComputers: 5,
      features: [
        '500 impressões/mês',
        '5 computadores',
        'Suporte prioritário',
        'Relatórios avançados',
        'API completa',
        'Webhooks'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 99.90,
      maxPrints: 2000,
      maxComputers: 20,
      features: [
        '2000 impressões/mês',
        '20 computadores',
        'Suporte 24/7',
        'API personalizada',
        'SLA garantido',
        'Integração dedicada',
        'Relatórios customizados'
      ],
      popular: false
    }
  ]

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) {
      return
    }
    
    // Aqui você implementaria a integração com Stripe
    console.log(`Upgrading to plan: ${planId}`)
    alert(`Funcionalidade de upgrade para o plano ${planId} será implementada em breve!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às necessidades da sua empresa
          </p>
        </div>

        {/* Current Plan Info */}
        <div className="card mb-12 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Plano Atual: {currentPlanDetails.name}
              </h2>
              <p className="text-white/80">
                {currentPlanDetails.maxPrints} impressões/mês • {currentPlanDetails.maxComputers} computadores
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                R$ {currentPlanDetails.price.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-white/80">por mês</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan
            const isUpgrade = plan.price > currentPlanDetails.price
            
            return (
              <div
                key={plan.id}
                className={`card relative ${
                  plan.popular 
                    ? 'ring-2 ring-primary-500 shadow-lg' 
                    : ''
                } ${
                  isCurrentPlan 
                    ? 'bg-primary-50 border-primary-200' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-gray-600">
                    {plan.maxPrints} impressões • {plan.maxComputers} computadores
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full ${
                    isCurrentPlan
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : isUpgrade
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? (
                    'Plano Atual'
                  ) : isUpgrade ? (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Fazer Upgrade
                    </>
                  ) : (
                    'Downgrade'
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Como funciona a cobrança?
              </h3>
              <p className="text-gray-600">
                A cobrança é feita mensalmente. Você pode fazer upgrade ou downgrade a qualquer momento, 
                e as mudanças serão aplicadas no próximo ciclo de faturamento.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode cancelar sua assinatura a qualquer momento. 
                Você continuará com acesso até o final do período pago.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                E se eu exceder o limite de impressões?
              </h3>
              <p className="text-gray-600">
                Se você exceder o limite, será notificado e poderá fazer upgrade 
                para um plano superior ou aguardar o próximo mês.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Há suporte técnico disponível?
              </h3>
              <p className="text-gray-600">
                Sim! O plano Gratuito inclui suporte básico por email. 
                Planos superiores incluem suporte prioritário e até 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card bg-gradient-primary text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de um plano personalizado?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Para empresas com necessidades específicas, oferecemos planos customizados 
            com limites e recursos sob medida.
          </p>
          <Button
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Falar com Vendas
          </Button>
        </div>
      </div>
    </div>
  )
} 