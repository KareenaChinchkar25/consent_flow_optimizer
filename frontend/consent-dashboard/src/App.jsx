import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import { ConsentProvider } from './context/ConsentContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <ErrorBoundary>
      <ConsentProvider>
        {showDashboard ? (
          <Dashboard />
        ) : (
          <LandingPage onEnterDashboard={() => setShowDashboard(true)} />
        )}
      </ConsentProvider>
    </ErrorBoundary>
  )
}

export default App