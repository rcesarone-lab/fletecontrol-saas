import React from 'react'

export default function Badge({ children }: { children: React.ReactNode }) {
  return <span style={{ background: '#eef', padding: '4px 8px', borderRadius: 999 }}>{children}</span>
}
