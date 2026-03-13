'use client'

import type { SavedAddress } from '@/types/user'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Pencil, Trash2 } from 'lucide-react'

interface AddressCardProps {
  address: SavedAddress
  onEdit: (address: SavedAddress) => void
  onDelete: (addressId: string) => void
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="rounded-md border border-border bg-bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-accent shrink-0 mt-1" strokeWidth={1.5} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-fg-primary">{address.label}</p>
              {address.isDefault && (
                <Badge variant="info" className="text-[10px]">Default</Badge>
              )}
            </div>
            <address className="text-sm text-fg-secondary not-italic leading-relaxed">
              {address.name}<br />
              {address.street}<br />
              {address.street2 && <>{address.street2}<br /></>}
              {address.postalCode} {address.city}<br />
              {address.country}
              {address.phone && <><br />{address.phone}</>}
            </address>
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(address)}
            aria-label={`Edit ${address.label} address`}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-error hover:text-error"
            onClick={() => onDelete(address.id)}
            aria-label={`Delete ${address.label} address`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  )
}
