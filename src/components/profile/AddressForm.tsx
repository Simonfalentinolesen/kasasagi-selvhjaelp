'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { savedAddressSchema, type SavedAddressInput } from '@/lib/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Modal } from '@/components/ui/Modal'
import type { SavedAddress } from '@/types/user'
import { useState } from 'react'

interface AddressFormProps {
  open: boolean
  onClose: () => void
  onSave: (data: SavedAddressInput) => Promise<void>
  address?: SavedAddress | null
}

export function AddressForm({ open, onClose, onSave, address }: AddressFormProps) {
  const [saving, setSaving] = useState(false)
  const isEditing = !!address

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SavedAddressInput>({
    resolver: zodResolver(savedAddressSchema),
    defaultValues: address
      ? {
          label: address.label,
          isDefault: address.isDefault,
          name: address.name,
          street: address.street,
          street2: address.street2 || '',
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone || '',
        }
      : {
          label: '',
          isDefault: false,
          name: '',
          street: '',
          street2: '',
          city: '',
          postalCode: '',
          country: 'Denmark',
          phone: '',
        },
  })

  const onSubmit = async (data: SavedAddressInput) => {
    setSaving(true)
    try {
      await onSave(data)
      reset()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Address' : 'Add New Address'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Label"
          placeholder="e.g., Home, Office, Summer house"
          error={errors.label?.message}
          {...register('label')}
        />

        <Input
          label="Full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Street address"
          error={errors.street?.message}
          {...register('street')}
        />

        <Input
          label="Street address 2 (optional)"
          placeholder="Apartment, floor, etc."
          {...register('street2')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Postal code"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
          <Input
            label="City"
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        <Input
          label="Country"
          error={errors.country?.message}
          {...register('country')}
        />

        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+45 00 00 00 00"
          {...register('phone')}
        />

        <Checkbox
          label="Set as default address"
          {...register('isDefault')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEditing ? 'Save changes' : 'Add address'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
