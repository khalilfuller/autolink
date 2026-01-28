export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4">
      <div className="max-w-3xl mx-auto text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span>AutoLink v1.0</span>
          </div>

          <div className="text-slate-500">
            made by{' '}
            <a
              href="https://www.linkedin.com/in/khalilfuller/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              Khalil
            </a>
            {' & Claude'}
          </div>
        </div>

        <div className="mt-3 text-center text-slate-500">
          Comments or feedback?{' '}
          <a
            href="mailto:khalil@pear.vc"
            className="text-slate-400 hover:text-orange-400 transition-colors"
          >
            khalil@pear.vc
          </a>
        </div>
      </div>
    </footer>
  )
}
