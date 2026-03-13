'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema, type PersonalInfoInput } from '@/lib/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types/user'
import { useState } from 'react'
import { Check } from 'lucide-react'

interface PersonalInfoFormProps {
  user: User
  onSave: (data: PersonalInfoInput) => Promise<void>
}

export function PersonalInfoForm({ user, onSave }: PersonalInfoFormProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
    },
  })

  const onSubmit = async (data: PersonalInfoInput) => {
    setSaving(true)
    try {
      await onSave(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={user.email}
        disabled
        helperText="Email cannot be changed through the self-service portal."
      />

      <Input
        label="Phone number"
        type="tel"
        placeholder="+45 00 00 00 00"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          disabled={!isDirty}
        >
          Save changes
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  )
}
