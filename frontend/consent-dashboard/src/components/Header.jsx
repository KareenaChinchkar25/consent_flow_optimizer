import React from 'react'
import { Shield, RefreshCw, Wifi, WifiOff, Cpu, Home } from 'lucide-react'
import { useConsent } from '../context/ConsentContext'

const Header = () => {
  const { fetchConsents, loading, lastUpdated, mlBackendStatus } = useConsent()

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleTimeString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-700 bg-green-100 border-green-300'
      case 'offline': return 'text-amber-700 bg-amber-100 border-amber-300'
      case 'checking': return 'text-blue-700 bg-blue-100 border-blue-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4" />
      case 'offline': return <WifiOff className="h-4 w-4" />
      case 'checking': return <Cpu className="h-4 w-4 animate-pulse" />
      default: return <Cpu className="h-4 w-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'ML Backend Online'
      case 'offline': return 'ML Backend Offline'
      case 'checking': return 'Checking Connection'
      default: return 'Unknown Status'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center space-x-4">
            {/* Home Button */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
              title="Back to Home"
            >
              <Home className="h-5 w-5" />
            </button>

            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Consent Risk Dashboard
                </h1>
                <p className="text-sm text-gray-500 leading-tight">
                  ML-Powered Privacy Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Status & Controls */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            {/* <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-semibold ${getStatusColor(mlBackendStatus)}`}>
              {getStatusIcon(mlBackendStatus)}
              <span className="hidden sm:inline">{getStatusText(mlBackendStatus)}</span>
            </div> */}

            {/* Last Updated Timestamp */}
            {lastUpdated && mlBackendStatus === 'online' && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs text-gray-500 font-medium">Last Updated</span>
                <span className="text-sm text-gray-700 font-semibold">
                  {formatTime(lastUpdated)}
                </span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={fetchConsents}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header