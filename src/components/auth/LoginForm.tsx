'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const { login, loading, error } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password)
      router.push('/profile')
    } catch {
      // error state handled by useAuth
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md border border-error/40 bg-error/5 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-error shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="anna@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Log in
      </Button>
    </form>
  )
}
