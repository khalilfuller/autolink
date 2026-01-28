export default function Hero() {
  return (
    <section className="py-12 px-4 bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-mono font-medium text-slate-100 mb-4">
          Never forget to connect with someone you met.
        </h1>

        <p className="text-slate-400 font-mono text-sm mb-8 leading-relaxed max-w-xl">
          A script that runs on your Google account, scans your sent emails and calendar weekly,
          and creates a spreadsheet of people to add on LinkedIn.
        </p>

        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href="#setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
          >
            <span className="text-orange-200">→</span>
            start setup
          </a>
          <span className="text-slate-500">takes 5 min</span>
        </div>

        {/* Privacy callout + feature list */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {/* Privacy note */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 font-mono text-xs">
            <div className="text-green-400 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% private
            </div>
            <p className="text-slate-400 leading-relaxed">
              This is a Google Apps Script you copy into your own account.
              Your data never leaves Google. We never see your emails.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 font-mono text-xs">
            <div className="text-slate-500 mb-2">// how it works</div>
            <div className="space-y-1.5 text-slate-300">
              <div><span className="text-slate-500">1.</span> Runs automatically every Friday night</div>
              <div><span className="text-slate-500">2.</span> Extracts names & companies from emails</div>
              <div><span className="text-slate-500">3.</span> Creates LinkedIn search links</div>
              <div><span className="text-slate-500">4.</span> You review & connect weekly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
