import React, { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Smartphone, 
  Shield,
  Calendar,
  Users,
  FileText,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

const ConsentCard = ({ consent, delay = 0, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Granted':
        return 'bg-green-100 text-green-800'
      case 'Revoked':
        return 'bg-red-100 text-red-800'
      case 'Denied':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const parseDataFlow = (dataFlow) => {
    try {
      if (typeof dataFlow === 'string') {
        return JSON.parse(dataFlow)
      }
      return dataFlow || []
    } catch {
      return []
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      // Call the parent component's status change handler
      if (onStatusChange) {
        await onStatusChange(consent.consentId, newStatus)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusButtonConfig = (currentStatus) => {
    const baseConfig = {
      Granted: {
        label: 'Grant Access',
        icon: CheckCircle,
        color: 'bg-green-500 hover:bg-green-600 text-white',
        action: 'Granted'
      },
      Revoked: {
        label: 'Revoke Access',
        icon: XCircle,
        color: 'bg-red-500 hover:bg-red-600 text-white',
        action: 'Revoked'
      },
      Denied: {
        label: 'Deny Access',
        icon: AlertTriangle,
        color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        action: 'Denied'
      }
    }

    // Remove the current status from available actions
    const availableActions = { ...baseConfig }
    delete availableActions[currentStatus]

    return Object.values(availableActions)
  }

  const dataFlowItems = parseDataFlow(consent.dataFlow)
  const availableActions = getStatusButtonConfig(consent.status)

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {consent.website}
                </h3>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consent.status)}`}>
                {consent.status}
              </span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(consent.risk_category)}`}>
                {consent.risk_category} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{consent.platform}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{consent.permission}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{consent.category}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="font-medium text-gray-900">
                  Score: {(consent.risk_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status Action Buttons
            {availableActions.map((action, index) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={action.action}
                  onClick={() => handleStatusChange(action.action)}
                  disabled={isUpdating}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    action.color
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md transform hover:-translate-y-0.5'}`}
                  title={`Change status to ${action.action}`}
                >
                  <ActionIcon className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ) */}
            {/* })} */}

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Status Update Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RotateCcw className="h-4 w-4" />
              <span>Update consent status:</span>
            </div>
            <div className="flex space-x-2">
              {availableActions.map((action) => {
                const ActionIcon = action.icon
                return (
                  <button
                    key={action.action}
                    onClick={() => handleStatusChange(action.action)}
                    disabled={isUpdating}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      action.color
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                  >
                    <ActionIcon className="h-3.5 w-3.5 mr-1.5" />
                    {action.action}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Purpose</h4>
                <p className="text-sm text-gray-600">{consent.purpose}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Granted On</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(consent.grantedOn)}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Retention Period</h4>
                <p className="text-sm text-gray-600">
                  {consent.retention_months} months
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {dataFlowItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Data Shared With</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dataFlowItems.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Consent ID</h4>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
                  {consent.consentId}
                </code>
              </div>

              {/* Status History Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Manage Consent</h4>
                <div className="flex flex-wrap gap-2">
                  {availableActions.map((action) => {
                    const ActionIcon = action.icon
                    return (
                      <button
                        key={action.action}
                        onClick={() => handleStatusChange(action.action)}
                        disabled={isUpdating}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          action.color
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                      >
                        <ActionIcon className="h-4 w-4 mr-2" />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Updating...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsentCard