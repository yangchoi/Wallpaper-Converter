'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import JsonLd from '@/components/JsonLd'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Wallpaper Converter',
  url: base,
  applicationCategory: 'Multimedia',
  operatingSystem: 'macOS, Windows',
  description: '동영상을 배경화면 포맷으로 변환',
}
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'hyojeong yang',
  url: base,
  logo: `${base}/apple-touch-icon.png`,
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
type Target = 'mac' | 'windows-webm' | 'windows-mp4'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState<Target>('mac')
  const [width, setWidth] = useState<number | ''>(1920)
  const [height, setHeight] = useState<number | ''>(1080)
  const [fps, setFps] = useState<number | ''>(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [hover, setHover] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearFile = useCallback(() => {
    setFile(null)
    setDownloadUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const openPicker = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }, [])

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [
    file,
  ])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setHover(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }, [])

  // convert
  const onConvert = async () => {
    if (!file) {
      setError('동영상을 선택해주세요.')
      return
    }

    setLoading(true)
    setError('')
    setDownloadUrl('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('target', target)
      if (width !== '') fd.append('width', String(width))
      if (height !== '') fd.append('height', String(height))
      if (fps !== '') fd.append('fps', String(fps))

      const res = await fetch(`${API_BASE}/convert`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error(await res.text())

      const data: { url: string } = await res.json()
      setDownloadUrl(`${API_BASE}${data.url}`) // ✅ API_BASE (오타 금지) + 백틱
    } catch (err) {
      const msg = err instanceof Error ? err.message : '변환 실패' // ✅ unknown 안전 처리
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // format size
  const sizeText = useMemo(() => {
    if (!file) return ''
    const kb = file.size / 1024
    if (kb < 1024) return `${kb.toFixed(0)} KB`
    return `${(kb / 1024).toFixed(2)} MB`
  }, [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <main className="flex-1 max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Video → Wallpaper Converter
        </h1>
        <p className="text-slate-400 mt-1">
          MP4/MOV/WEBM → macOS(.mov) / Windows(.webm/.mp4)
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 좌측: 업로드/옵션 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300">1) 업로드</h2>

          {/* 숨김 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* 업로드 박스 */}
          <div
            onDragEnter={() => setHover(true)}
            onDragOver={(e) => {
              e.preventDefault()
              setHover(true)
            }}
            onDragLeave={() => setHover(false)}
            onDrop={onDrop}
            className={[
              'mt-2 rounded-xl border-2 border-dashed transition-colors',
              file
                ? 'border-green-600 bg-green-600/10 p-3'
                : hover
                ? 'h-44 flex items-center justify-center border-blue-500 bg-blue-500/10'
                : 'h-44 flex items-center justify-center border-slate-700',
            ].join(' ')}
          >
            {!file ? (
              <div className="text-center text-slate-300">
                <p className="text-sm">여기로 드래그&드롭 하거나</p>
                <button
                  type="button"
                  onClick={openPicker}
                  className="mt-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700"
                >
                  파일 선택
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between gap-3">
                {/* 파일명 칩 (클릭 시 다시 선택) */}
                <button
                  type="button"
                  onClick={openPicker}
                  className="truncate text-left grow px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 hover:border-slate-500"
                  title="다시 선택하려면 클릭"
                >
                  <span className="block text-xs text-slate-400">
                    선택된 파일
                  </span>
                  <span className="block font-medium truncate">
                    {file.name}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {sizeText}
                  </span>
                </button>

                {/* X 버튼 (선택 취소) */}
                <button
                  type="button"
                  onClick={clearFile}
                  className="shrink-0 w-9 h-9 grid place-items-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                  aria-label="파일 선택 취소"
                  title="파일 선택 취소"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* 옵션 */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <label className="text-sm">
              플랫폼
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as Target)}
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 p-2 text-sm"
              >
                <option value="mac">macOS (.mov)</option>
                <option value="windows-webm">Windows (.webm)</option>
                <option value="windows-mp4">Windows (.mp4)</option>
              </select>
            </label>
            <label className="text-sm">
              Width
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value || '1920'))}
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 p-2 text-sm"
              />
            </label>
            <label className="text-sm">
              Height
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value || '1080'))}
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 p-2 text-sm"
              />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <label className="text-sm">
              FPS
              <input
                type="number"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value || '30'))}
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 p-2 text-sm"
              />
            </label>
          </div>

          {/* 버튼 + 로더 */}
          <button
            onClick={onConvert}
            disabled={loading || !file}
            className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 font-semibold py-2"
          >
            {loading ? '변환 중…' : '변환하기'}
          </button>

          {loading && (
            <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-2 w-1/3 bg-blue-500 animate-[progress_1.2s_ease_infinite]" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </section>

        {/* 우측: 미리보기 + 가이드 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300">2) 미리보기</h2>
          {previewUrl ? (
            <video
              src={previewUrl}
              controls
              className="mt-2 w-full rounded-xl"
            />
          ) : (
            <div className="mt-2 h-44 rounded-xl border border-slate-800 grid place-items-center text-slate-500">
              영상 미리보기
            </div>
          )}
        </section>
      </div>

      {/* 3) 다운로드 섹션 */}
      {downloadUrl && (
        <section className="mt-8 p-6 bg-green-950/40 border border-green-700 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-green-300 mb-4">
            변환이 완료되었습니다!
          </h2>
          <a
            href={downloadUrl}
            download
            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-500 rounded-xl"
          >
            📥 변환된 파일 다운로드
          </a>
          <p className="mt-2 text-sm text-green-200">
            /files/* 경로로 제공됩니다.
          </p>
        </section>
      )}

      {/* progress keyframes */}
      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>

      <JsonLd json={webAppLd} />
      <JsonLd json={orgLd} />
    </main>
  )
}
