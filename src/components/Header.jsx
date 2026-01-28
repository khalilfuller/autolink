export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="font-mono font-medium text-slate-100 text-sm">autolink</span>
          <span className="text-slate-500 text-xs font-mono">v1.0</span>
        </a>
        <div className="flex items-center gap-4 text-xs font-mono">
          <a href="#setup" className="text-slate-400 hover:text-slate-200 transition-colors">
            setup
          </a>
          <a href="#code" className="text-slate-400 hover:text-slate-200 transition-colors">
            code
          </a>
          <a href="#faq" className="text-slate-400 hover:text-slate-200 transition-colors">
            faq
          </a>
        </div>
      </div>
    </header>
  )
}
