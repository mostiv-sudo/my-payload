'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const getColor = (value: number) => {
  if (value >= 80) return '#22c55e' // green
  if (value >= 50) return '#eab308' // yellow
  return '#ef4444' // red
}

const CompletionBar: React.FC<{ path: string }> = ({ path }) => {
  const { value } = useField<number>({ path })

  const percent = Math.min(Math.max(value ?? 0, 0), 100)
  const color = getColor(percent)

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          height: 8,
          background: '#e5e7eb',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div
        style={{
          fontSize: 12,
          color: '#6b7280',
          textAlign: 'right',
        }}
      >
        {percent}%
      </div>
    </div>
  )
}

export default CompletionBar
