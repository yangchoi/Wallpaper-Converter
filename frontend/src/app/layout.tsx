import './globals.css'
import Script from 'next/script'
import Footer from '@/components/Footer'
import AdBanner from '@/components/AdBanner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === '1'

  return (
    <html lang="ko">
      <head>
        <Script
          id="adsense-loader"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5687181207100282"
          crossOrigin="anonymous"
        />

        {enableAds && (
          <Script
            id="adsense-loader"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased flex flex-col">
        <main className="flex-1">{children}</main>

        {/* 🔽 푸터 바로 위 광고 */}
        {enableAds && <AdBanner />}

        <Footer />
      </body>
    </html>
  )
}
