import { useState } from 'react'

export default function CodeBlock({ code, domains }) {
  const [copied, setCopied] = useState(false)

  const validDomains = domains.filter(d => d.trim() !== '')
  const hasCustomDomains = validDomains.length > 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section id="code" className="py-12 px-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono text-lg text-slate-100 mb-6">Code</h2>

        {/* Status indicator */}
        {hasCustomDomains ? (
          <div className="mb-4 flex items-center gap-2 text-xs font-mono">
            <span className="text-green-400">✓</span>
            <span className="text-slate-400">
              excluding: <code className="text-green-400">{validDomains.join(', ')}</code>
            </span>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400">!</span>
            <span className="text-slate-400">
              no domains configured — <a href="#setup" className="text-orange-400 hover:text-orange-300">go to step 3</a>
            </span>
          </div>
        )}

        <div className="relative">
          {/* Code display */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-700/50 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="ml-2 text-slate-400 text-xs font-mono">Code.gs</span>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
                }`}
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto max-h-80 text-xs">
              <code className="text-slate-400 whitespace-pre font-mono">{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
