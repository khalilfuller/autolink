import { useState } from 'react'

// Domain Input Component - dark theme
function DomainInput({ domains, setDomains }) {
  const addDomain = () => {
    setDomains([...domains, ''])
  }

  const removeDomain = (index) => {
    if (domains.length > 1) {
      setDomains(domains.filter((_, i) => i !== index))
    }
  }

  const updateDomain = (index, value) => {
    const newDomains = [...domains]
    newDomains[index] = value
    setDomains(newDomains)
  }

  const validDomains = domains.filter(d => d.trim() !== '')

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm">
        Contacts from these domains will be excluded from your list.
      </p>

      <div className="space-y-2">
        {domains.map((domain, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">@</span>
              <input
                type="text"
                value={domain}
                onChange={(e) => updateDomain(index, e.target.value.toLowerCase().replace(/^@/, ''))}
                placeholder="yourcompany.com"
                className="w-full pl-7 pr-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-200 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors placeholder-slate-500"
              />
            </div>
            {domains.length > 1 && (
              <button
                onClick={() => removeDomain(index)}
                className="px-2 text-slate-500 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addDomain}
        className="text-orange-400 hover:text-orange-300 text-xs font-mono transition-colors"
      >
        + add domain
      </button>

      {/* Live preview */}
      <div className="bg-slate-800 rounded p-3 mt-3 border border-slate-700">
        <code className="text-green-400 text-xs font-mono">
          OWN_DOMAINS: [{validDomains.length > 0 ? validDomains.map(d => `'${d}'`).join(', ') : "'yourcompany.com'"}]
        </code>
      </div>
    </div>
  )
}

// Lookback Period Selector - dark theme
function LookbackSelector({ initialLookback, setInitialLookback }) {
  const options = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
    { value: 365, label: '1 year' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm">
        How far back to scan on first run?
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setInitialLookback(option.value)}
            className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
              initialLookback === option.value
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-slate-500'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-slate-500 text-xs font-mono">
        // after first run: scans last 7 days every Friday night
      </p>
    </div>
  )
}

// Code Copy Component - dark theme
function CodeCopyStep({ script, domains, initialLookback }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <p className="text-slate-400">
          In Apps Script, you'll see some default code. Here's what to do:
        </p>
        <ol className="space-y-1 text-slate-400">
          <li className="flex gap-2">
            <span className="text-slate-500">1.</span>
            Select all the existing code and delete it
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">2.</span>
            Click the button below to copy the AutoLink code
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">3.</span>
            Paste it into the editor
          </li>
        </ol>
      </div>

      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded font-mono text-sm transition-all ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}
      >
        {copied ? '✓ Copied to clipboard!' : 'Copy AutoLink code'}
      </button>

      {/* Code Preview */}
      <div className="bg-slate-800 rounded border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border-b border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span className="ml-2 text-slate-400 text-xs font-mono">Code.gs</span>
        </div>
        <pre className="p-3 overflow-x-auto max-h-32 text-xs">
          <code className="text-slate-400 whitespace-pre font-mono">{script.slice(0, 500)}...</code>
        </pre>
      </div>
    </div>
  )
}

// Step definitions
const getSteps = (domains, setDomains, initialLookback, setInitialLookback, script) => [
  {
    id: 'open',
    title: 'Create a new Apps Script project',
    content: (
      <div className="space-y-3">
        <a
          href="https://script.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-mono text-sm transition-colors"
        >
          → script.google.com
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="text-slate-400 text-sm">
          Click "New project", then rename it from "Untitled project" to <code className="text-orange-400">AutoLink - Weekly Contacts To Add</code>
        </p>
      </div>
    ),
  },
  {
    id: 'config',
    title: 'Configure settings',
    content: (
      <div className="space-y-6">
        <LookbackSelector initialLookback={initialLookback} setInitialLookback={setInitialLookback} />
        <DomainInput domains={domains} setDomains={setDomains} />
      </div>
    ),
  },
  {
    id: 'paste',
    title: 'Paste the code',
    content: <CodeCopyStep script={script} domains={domains} initialLookback={initialLookback} />,
  },
  {
    id: 'save',
    title: 'Save the script',
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-slate-400">
          Save your script using the keyboard shortcut:
        </p>
        <div className="flex gap-6">
          <div className="bg-slate-800 rounded px-3 py-2 border border-slate-700">
            <span className="text-slate-500 text-xs">Mac</span>
            <div className="text-slate-200 font-mono">⌘ + S</div>
          </div>
          <div className="bg-slate-800 rounded px-3 py-2 border border-slate-700">
            <span className="text-slate-500 text-xs">Windows</span>
            <div className="text-slate-200 font-mono">Ctrl + S</div>
          </div>
        </div>
        <p className="text-slate-500 text-xs">
          You should see "Saving..." appear briefly in the toolbar.
        </p>
      </div>
    ),
  },
  {
    id: 'run',
    title: 'Run the setup function',
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-slate-400">
          Look at the toolbar near the top of the code editor. You'll see a dropdown menu that might say "myFunction" or similar.
        </p>
        <ol className="space-y-2 text-slate-400">
          <li className="flex gap-2">
            <span className="text-slate-500">1.</span>
            Click the dropdown and select <code className="text-orange-400 bg-slate-800 px-1 rounded">setup</code>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">2.</span>
            Click the <strong>Run</strong> button (▶) to the left of the dropdown
          </li>
        </ol>
        <p className="text-slate-500 text-xs mt-2">
          Ignore the blue "Deploy" button in the corner — you don't need it.
        </p>
        <p className="text-amber-400/80 text-xs mt-2">
          ⏱ Scanning a full year of emails may take a few minutes. The script runs in the background.
        </p>
      </div>
    ),
  },
  {
    id: 'auth',
    title: 'Authorize access',
    content: (
      <div className="space-y-2 text-sm text-slate-400">
        <p>Click through the Google permission dialogs:</p>
        <div className="font-mono text-xs space-y-1 text-slate-500">
          <div>1. "Review permissions"</div>
          <div>2. "Advanced" → "Go to AutoLink (unsafe)"</div>
          <div>3. Check "Select all" → "Continue"</div>
        </div>
        <p className="text-slate-500 text-xs mt-2">
          "Unsafe" = Google hasn't reviewed it. It's your own script, it's fine.
        </p>
      </div>
    ),
  },
  {
    id: 'done',
    title: 'Open your sheet',
    content: (
      <div className="space-y-3">
        <div className="p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
          <p className="text-green-400 text-sm font-medium">🎉 You're all set!</p>
          <p className="text-green-300/80 text-xs mt-1">
            The script is now scanning your emails and calendar. Give it a few minutes to populate the sheet, then open your new spreadsheet:
          </p>
        </div>
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-mono text-sm transition-colors"
        >
          → drive.google.com
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="text-slate-400 text-sm">
          Find "AutoLink" in recent files. Runs automatically overnight on Friday nights.
        </p>
      </div>
    ),
  },
]

export default function Steps({ currentStep, setCurrentStep, domains, setDomains, initialLookback, setInitialLookback, script }) {
  const steps = getSteps(domains, setDomains, initialLookback, setInitialLookback, script)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const toggleComplete = (stepId, index) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
      // Auto-expand next step if there is one
      if (index < steps.length - 1) {
        setCurrentStep(index + 1)
      }
    }
    setCompletedSteps(newCompleted)
  }

  const toggleExpand = (index) => {
    setCurrentStep(currentStep === index ? -1 : index)
  }

  return (
    <section id="setup" className="py-12 px-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono text-lg text-slate-100 mb-6">Setup</h2>

        <div className="space-y-1">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id)
            const isExpanded = currentStep === index

            return (
              <div
                key={step.id}
                className={`border-l-2 transition-colors ${
                  isCompleted ? 'border-green-500' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 py-2 px-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(step.id, index)}
                    className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {isCompleted && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Step title and content */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(index)}
                      className={`flex items-center gap-2 text-left w-full group ${
                        isCompleted ? 'text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      <span className="text-slate-500 font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                      <span className={`font-mono text-sm ${isCompleted ? 'line-through' : ''}`}>
                        {step.title}
                      </span>
                      <svg
                        className={`w-3 h-3 text-slate-500 transition-transform ml-auto ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pb-2 pl-6">
                        {step.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">
              {completedSteps.size}/{steps.length} completed
            </span>
            {completedSteps.size === steps.length && (
              <span className="text-green-400">✓ setup complete</span>
            )}
          </div>

          {/* Completion tip */}
          {completedSteps.size === steps.length && (
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-slate-300 text-sm font-medium mb-2">📅 One more thing...</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Set a recurring reminder on your calendar or to-do list for <span className="text-orange-400">Sunday mornings</span> to
                check your AutoLink sheet and send connection requests on LinkedIn.
              </p>
              <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                <span className="text-slate-400">Why not fully automated?</span> Computer-use agents are still unreliable for
                LinkedIn automation. You could try asking <a href="https://cowork.gg" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">CoWork</a> to
                click through the links and add people — and over time we'll add more automation to AutoLink.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
