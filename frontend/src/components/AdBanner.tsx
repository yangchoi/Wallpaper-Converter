'use client'
import { useEffect } from 'react'
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner() {
  useEffect(() => {
    try {
      /* @ts-ignore */ ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div className="border-t border-slate-800 bg-slate-900/60">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 120 }}
          data-ad-client="ca-pub-5687181207100282"
          data-ad-slot="pub-5687181207100282"
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : undefined}
        />
      </div>
    </div>
  )
}
