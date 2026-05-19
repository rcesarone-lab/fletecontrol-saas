import React from 'react'

export default function SignatureCard({ name }: { name?: string }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div style={{ height: 48, background: '#f3f3f3' }} />
      <div style={{ marginTop: 8 }}>{name}</div>
    </div>
  )
}
