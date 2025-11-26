import React from 'react'
import Header from './Header'
import StatsCards from './StatsCards'
import Filters from './Filters'
import ConsentList from './ConsentList'
import LoadingSpinner from './LoadingSpinner'
import { useConsent } from '../context/ConsentContext'
import { Wifi, WifiOff } from 'lucide-react'  // Add missing imports

const Dashboard = () => {
  const { loading, error, mlBackendStatus } = useConsent()

  if (error && mlBackendStatus === 'offline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ML Backend Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="text-left text-sm text-gray-500 bg-white p-6 rounded-lg border shadow-sm">
            <p className="font-semibold mb-3 text-lg">🚀 Quick Setup Guide:</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Start ML Backend</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                    cd Consent-Flow-Optimizer && uvicorn ml_backend.app.main:app --reload --port 8000
                  </code>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Ensure Data Files Exist</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                    data/unseen_consents.xlsx
                  </code>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Verify Endpoint</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                    http://127.0.0.1:8000/predicted
                  </code>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-gray-500 text-sm">
            Currently showing demo data. Real predictions will load automatically when ML backend is available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        {/* Success Banner */}
        {mlBackendStatus === 'online' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Connected to ML Backend
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Showing real-time predictions from your trained CatBoost model.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <StatsCards />
          <Filters />
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ConsentList />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard