'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, ...props }, ref) => {
    const checkboxId = id || props.name

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span className="relative flex h-5 w-5 shrink-0">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'absolute inset-0 rounded border transition-all duration-fast',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1',
              checked
                ? 'bg-accent border-accent'
                : 'border-border bg-bg-surface hover:border-fg-muted'
            )}
          />
          {checked && (
            <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" strokeWidth={3} />
          )}
        </span>
        {label && <span className="text-sm text-fg-primary">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
