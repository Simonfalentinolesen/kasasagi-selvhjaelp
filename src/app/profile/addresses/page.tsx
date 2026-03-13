'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { AddressCard } from '@/components/profile/AddressCard'
import { AddressForm } from '@/components/profile/AddressForm'
import { Button } from '@/components/ui/Button'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import type { SavedAddress } from '@/types/user'
import type { SavedAddressInput } from '@/lib/validation'
import { MapPin, Plus } from 'lucide-react'

export default function ProfileAddressesPage() {
  const { profile, loading, addAddress, updateAddress, deleteAddress } = useProfile()
  const [formOpen, setFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address)
    setFormOpen(true)
  }

  const handleDelete = async (addressId: string) => {
    await deleteAddress(addressId)
  }

  const handleSave = async (data: SavedAddressInput) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data)
    } else {
      await addAddress(data)
    }
    setEditingAddress(null)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditingAddress(null)
  }

  const handleAdd = () => {
    setEditingAddress(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-fg-primary">Saved Addresses</h1>
        <Button size="sm" variant="primary" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" strokeWidth={1.5} />
          Add address
        </Button>
      </div>

      {loading || !profile ? (
        <div className="space-y-3">
          <SkeletonLoader className="h-32 w-full" />
          <SkeletonLoader className="h-32 w-full" />
        </div>
      ) : profile.savedAddresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-10 w-10" strokeWidth={1} />}
          title="No saved addresses yet"
          description="Save an address here so it's ready to go whenever you need to update a delivery or place an order."
          action={{ label: 'Add your first address', onClick: handleAdd }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.savedAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddressForm
        key={editingAddress?.id || 'new'}
        open={formOpen}
        onClose={handleClose}
        onSave={handleSave}
        address={editingAddress}
      />
    </div>
  )
}
