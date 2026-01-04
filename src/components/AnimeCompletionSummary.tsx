'use client'

import React from 'react'
import type { BeforeListTableClientProps } from 'payload'

export default function AnimeCompletionSummary(props: BeforeListTableClientProps) {
  const { data }: any = props

  if (!data?.docs?.length) return null

  const avg =
    Math.round(
      data.docs.reduce((sum: number, doc: any) => sum + (doc.completion ?? 0), 0) /
        data.docs.length,
    ) || 0

  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        marginBottom: 12,
      }}
    >
      <strong>Средняя заполненность</strong>

      <div
        style={{
          marginTop: 8,
          height: 8,
          background: '#e5e7eb',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${avg}%`,
            height: '100%',
            background: avg >= 80 ? '#22c55e' : avg >= 50 ? '#eab308' : '#ef4444',
          }}
        />
      </div>

      <div
        style={{
          fontSize: 12,
          marginTop: 4,
          textAlign: 'right',
          color: '#6b7280',
        }}
      >
        {avg}%
      </div>
    </div>
  )
}
