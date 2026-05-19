import React from 'react'

export default function EmptyState({ message }: { message?: string }) {
  return <div style={{ padding: 24, textAlign: 'center', color: '#777' }}>{message || 'No hay datos'}</div>
}
