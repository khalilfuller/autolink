import { useState, useMemo } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Steps from './components/Steps'
import CodeBlock from './components/CodeBlock'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { getAutoLinkScript } from './data/script'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [domains, setDomains] = useState([''])
  const [initialLookback, setInitialLookback] = useState(30) // Default to 30 days

  // Generate script with user's domains and lookback period
  const script = useMemo(() => {
    const validDomains = domains.filter(d => d.trim() !== '')
    return getAutoLinkScript(
      validDomains.length > 0 ? validDomains : ['yourcompany.com'],
      initialLookback
    )
  }, [domains, initialLookback])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main>
        <Hero />
        <Steps
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          domains={domains}
          setDomains={setDomains}
          initialLookback={initialLookback}
          setInitialLookback={setInitialLookback}
          script={script}
        />
        <CodeBlock code={script} domains={domains} />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App
