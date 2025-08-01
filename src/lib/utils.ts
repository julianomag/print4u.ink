import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getPlanDetails(planId: string) {
  const plans = {
    free: {
      name: 'Gratuito',
      maxPrints: 20,
      maxComputers: 1,
      price: 0,
      features: ['20 impressões/mês', '1 computador', 'Suporte básico']
    },
    pro: {
      name: 'Profissional',
      maxPrints: 500,
      maxComputers: 5,
      price: 29.90,
      features: ['500 impressões/mês', '5 computadores', 'Suporte prioritário', 'Relatórios avançados']
    },
    enterprise: {
      name: 'Empresarial',
      maxPrints: 2000,
      maxComputers: 20,
      price: 99.90,
      features: ['2000 impressões/mês', '20 computadores', 'Suporte 24/7', 'API personalizada', 'SLA garantido']
    }
  }
  
  return plans[planId as keyof typeof plans] || plans.free
} 