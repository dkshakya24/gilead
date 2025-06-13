'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store/useStore'

export default function ReasoningFactor() {
  const { reasoning, setReasoning } = useStore()

  const handleToggle = (checked: boolean) => {
    setReasoning(checked ? 'High' : 'Low')
  }

  return (
    <div className="flex items-center space-x-2">
      <Label
        htmlFor="reasoning-factor"
        className="cursor-pointer"
        onClick={() => handleToggle(reasoning === 'Low')}
      >
        Reasoning Factor
      </Label>
      <Switch
        id="reasoning-factor"
        checked={reasoning === 'Low'}
        onCheckedChange={handleToggle}
      />
    </div>
  )
}
