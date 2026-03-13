'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { orderLookupSchema, type OrderLookupInput } from '@/lib/validation'
import { useOrderLookup } from '@/hooks/useOrderLookup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

export function OrderLookup() {
  const { lookup, state, error } = useOrderLookup()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderLookupInput>({
    resolver: zodResolver(orderLookupSchema),
    defaultValues: { orderNumber: '', email: '' },
  })

  const onSubmit = (data: OrderLookupInput) => {
    lookup(data.orderNumber, data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Order number"
        placeholder="e.g. KAS-10042"
        error={errors.orderNumber?.message}
        className="font-mono"
        {...register('orderNumber')}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="The email used for your order"
        error={errors.email?.message}
        {...register('email')}
      />
      {error && (
        <div className="rounded-md bg-red-50 p-3" role="alert">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}
      <Button
        type="submit"
        loading={state === 'loading'}
        icon={<Search className="h-4 w-4" />}
        className="w-full"
      >
        Find my order
      </Button>
    </form>
  )
}
