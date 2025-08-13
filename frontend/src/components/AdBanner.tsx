'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner() {
  const inited = useRef(false)

  useEffect(() => {
    if (inited.current) return
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || []
        ;(window.adsbygoogle as unknown[]).push({})
        inited.current = true
      }
    } catch {
      /* dev/애드블록/미승인인 경우 무시 */
    }
  }, [])

  return (
    <div className="border-t border-slate-800 bg-slate-900/60">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 120 }}
          data-ad-client="ca-pub-5687181207100282"
          data-ad-slot="9559661716"
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : undefined}
        />
      </div>
    </div>
  )
}
