import React from 'react'
import { AlertTriangle, CheckCircle, Info, BarChart3 } from 'lucide-react'
import { useConsent } from '../context/ConsentContext'

const StatsCards = () => {
  const { stats } = useConsent()

  const statItems = [
    {
      label: 'Total Consents',
      value: stats.total,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'High Risk',
      value: stats.highRisk,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      label: 'Medium Risk',
      value: stats.mediumRisk,
      icon: Info,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Low Risk',
      value: stats.lowRisk,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 animate-fade-in"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.textColor}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards