export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {new Date().getFullYear()} 만든이: Yang Hyojeong / Built with ♥ in
          Seoul ✨
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yangchoi/Wallpaper-Converter"
            target="_blank"
            className="hover:text-slate-200"
          >
            GitHub
          </a>
          <span className="text-slate-600">·</span>
          <span>Next.js + NestJS + FFmpeg</span>
        </div>
      </div>
    </footer>
  )
}
