export default function Hero() {
  return (
    <section className="py-12 px-4 bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-mono font-medium text-slate-100 mb-4">
          Scan Gmail & Calendar. Track contacts. Connect on LinkedIn.
        </h1>

        <p className="text-slate-400 font-mono text-sm mb-8 leading-relaxed">
          A Google Apps Script that runs weekly, finds people you've emailed or met with,
          and creates LinkedIn search links in a Google Sheet.
        </p>

        <div className="flex items-center gap-6 text-xs font-mono">
          <a
            href="#setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
          >
            <span className="text-orange-200">→</span>
            start setup
          </a>
          <a
            href="#code"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            view script code
          </a>
        </div>

        {/* Terminal-style feature list */}
        <div className="mt-12 bg-slate-800 rounded-lg border border-slate-700 p-4 font-mono text-xs">
          <div className="text-slate-500 mb-3">// what it does</div>
          <div className="space-y-2 text-slate-300">
            <div><span className="text-slate-500">1.</span> Scans your sent emails and calendar meetings weekly</div>
            <div><span className="text-slate-500">2.</span> Extracts names, companies, titles from signatures</div>
            <div><span className="text-slate-500">3.</span> Creates LinkedIn search links for each contact</div>
            <div><span className="text-slate-500">4.</span> Saves to Google Sheet with weekly tabs</div>
          </div>
        </div>
      </div>
    </section>
  )
}
