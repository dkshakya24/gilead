import React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded-3xl border-gray-300 text-crimson-600 cursor-pointer focus:ring-crimson-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label className="ml-2 text-[12px] text-[#666666]" htmlFor={props.id}>
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
