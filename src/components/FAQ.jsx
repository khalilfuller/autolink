import { useState } from 'react'

const faqs = [
  {
    question: "When does it run?",
    answer: "Every Friday night (technically Saturday at 3am). Check your sheet on Saturday mornings for new contacts from the past week."
  },
  {
    question: "Where do I find my contacts?",
    answer: "In Google Drive, look for the 'AutoLink' spreadsheet. Each week gets its own tab with only new contacts — people already in your Master list won't appear again."
  },
  {
    question: "No contacts appeared?",
    answer: "Make sure you've sent emails or had meetings in the lookback period you selected. The domain exclusion should be your work domain (like 'acme.com'), not 'gmail.com' — if you exclude gmail.com, you'll filter out most personal contacts."
  },
  {
    question: "Google says 'unsafe' — is this okay?",
    answer: "Yes, totally normal. Google shows this for any personal script they haven't reviewed. It's your own code running in your own account."
  },
  {
    question: "How do I start over?",
    answer: "In the Apps Script editor, select 'resetSetup' from the dropdown and click Run. Then select 'setup' and Run again. You can delete the old spreadsheet from Drive."
  },
  {
    question: "Is my data safe?",
    answer: "Yes. Everything runs inside your Google account. No data is sent anywhere external — you can review the full source code above."
  },
  {
    question: "What if I change my email domain?",
    answer: "Run 'resetSetup' then 'setup' again with the new domain. Your old spreadsheet data stays intact."
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-12 px-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono text-lg text-slate-100 mb-6">FAQ</h2>

        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-l-2 border-slate-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 py-2 flex items-center justify-between text-left group"
              >
                <span className="font-mono text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                  {faq.question}
                </span>
                <svg
                  className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-3 pl-8">
                  <p className="text-slate-400 text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
