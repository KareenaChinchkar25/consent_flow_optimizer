import React, { useState } from "react";
import PropTypes from "prop-types";
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
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const ConsentCard = ({ consent, delay = 0, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getRiskColor = (level) => {
    if (level === "High") 
      return {
        bg: "bg-gradient-to-r from-red-50 to-red-50/50",
        text: "text-red-700",
        border: "border-red-200",
        icon: "text-red-500",
        gradient: "from-red-500 to-red-600",
        glow: "shadow-red-100"
      };
    if (level === "Medium")
      return {
        bg: "bg-gradient-to-r from-amber-50 to-amber-50/50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: "text-amber-500",
        gradient: "from-amber-500 to-amber-600",
        glow: "shadow-amber-100"
      };
    if (level === "Low") 
      return {
        bg: "bg-gradient-to-r from-emerald-50 to-emerald-50/50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "text-emerald-500",
        gradient: "from-emerald-500 to-emerald-600",
        glow: "shadow-emerald-100"
      };
    return {
      bg: "bg-gradient-to-r from-gray-50 to-gray-50/50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: "text-gray-500",
      gradient: "from-gray-500 to-gray-600",
      glow: "shadow-gray-100"
    };
  };

  const getStatusColor = (status) => {
    if (status === "Granted") 
      return {
        bg: "bg-gradient-to-r from-emerald-50 to-emerald-50/90",
        text: "text-emerald-700",
        icon: <CheckCircle className="w-3 h-3" />,
        gradient: "from-emerald-500 to-emerald-600",
        badge: "bg-emerald-100 text-emerald-800"
      };
    if (status === "Revoked") 
      return {
        bg: "bg-gradient-to-r from-rose-50 to-rose-50/90",
        text: "text-rose-700",
        icon: <XCircle className="w-3 h-3" />,
        gradient: "from-rose-500 to-rose-600",
        badge: "bg-rose-100 text-rose-800"
      };
    if (status === "Denied") 
      return {
        bg: "bg-gradient-to-r from-amber-50 to-amber-50/90",
        text: "text-amber-700",
        icon: <AlertTriangle className="w-3 h-3" />,
        gradient: "from-amber-500 to-amber-600",
        badge: "bg-amber-100 text-amber-800"
      };
    if (status === "Pending") 
      return {
        bg: "bg-gradient-to-r from-blue-50 to-blue-50/90",
        text: "text-blue-700",
        icon: <Clock className="w-3 h-3" />,
        gradient: "from-blue-500 to-blue-600",
        badge: "bg-blue-100 text-blue-800"
      };
    return {
      bg: "bg-gradient-to-r from-gray-50 to-gray-50/90",
      text: "text-gray-700",
      icon: null,
      gradient: "from-gray-500 to-gray-600",
      badge: "bg-gray-100 text-gray-800"
    };
  };

  const formatDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 const displayRisk = () => {
  const raw = Number(consent?.risk_score ?? 0);

  // normalize to 0–1
  const normalized = raw <= 1 ? raw : raw / 10;

  return {
    percentage: `${Math.round(normalized * 100)}%`,
    numeric: normalized * 100, // useful for progress bars
    level: consent?.risk_level
  };
};

  console.log(consent);
  const getDisplayWebsite = (value) => {
    if (!value) return "Unknown site";
    try {
      return value.startsWith("http")
        ? new URL(value).hostname.replace("www.", "")
        : value.replace("www.", "");
    } catch {
      return value;
    }
  };

  
  const EXTENSION_ID = "ahgccmghbbnfjebfbgkedlfmeijdaigp";


const handleManageConsent = async () => {
  if (isUpdating) return;
  setIsUpdating(true);

  try {
    const domain = getDisplayWebsite(consent.website);
    const site = `https://${domain}`;

    // ✅ Explicit external messaging attempt
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage(
        EXTENSION_ID,
        {
          type: "OPEN_SITE_SETTINGS",
          site,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "External messaging blocked:",
              chrome.runtime.lastError.message
            );
            window.open(site, "_blank");
          } else if (!response?.opened) {
            window.open(site, "_blank");
          }
        }
      );
    } else {
      // Non-Chromium browsers
      window.open(site, "_blank");
      alert(
        "To change permissions:\n" +
        "Open browser settings → Site settings → Permissions"
      );
    }

    await onStatusChange({
      website: consent.website,
      permission: consent.permission,
      status: "Pending",
    });
  } catch (err) {
    console.error(err);
  } finally {
    setIsUpdating(false);
  }
};



  const risk = displayRisk();
  const riskColors = getRiskColor(consent.risk_category);
  const statusColors = getStatusColor(consent.status);

  return (
    <div
      className="relative group"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Glow Effect */}
      <div className={`absolute -inset-0.5 ${riskColors.glow} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
      
      <div
        className={`relative bg-gradient-to-br from-white to-white/95 border ${riskColors.border} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
      >
        {/* Risk Level Indicator Bar */}
       

        <div
          className={`p-6 transition-all duration-300 ${isUpdating ? "opacity-70 pointer-events-none" : ""}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Website with Icon */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg blur opacity-20"></div>
                    <div className="relative p-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {getDisplayWebsite(consent.website)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Website • {consent.platform}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusColors.bg} ${statusColors.text} border ${riskColors.border}`}>
                  {statusColors.icon}
                  <span className="text-sm font-semibold">{consent.status}</span>
                </div>

                {/* Risk Badge */}
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${riskColors.bg} ${riskColors.text} border ${riskColors.border}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{consent.risk_category} Risk</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-gray-50/50 to-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Platform</p>
                    <p className="font-medium text-gray-900">{consent.platform}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Permission</p>
                    <p className="font-medium text-gray-900">{consent.permission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{consent.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                 <p className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
  {risk.percentage}
</p>

<div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
  <div
    className={`h-full bg-gradient-to-r ${riskColors.gradient} transition-all duration-1000`}
    style={{ width: `${risk.numeric}%` }}
  ></div>
</div>

                </div>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`ml-4 p-2.5 rounded-xl border ${riskColors.border} bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 ${isExpanded ? 'bg-gradient-to-br from-gray-50 to-white' : ''}`}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Action Bar */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="p-2 bg-gray-100 rounded-lg">
                <RotateCcw className="w-4 h-4 text-gray-500" />
              </div>
              <span className="font-medium">Need to manage this consent?</span>
            </div>

            <div className="relative group/button">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover/button:opacity-100 transition duration-500"></div>
              <button
                onClick={handleManageConsent}
                disabled={isUpdating}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="flex items-center gap-2">
                  Manage on Site
                  <Sparkles className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50/50 to-white px-6 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Purpose
                  </h4>
                  <p className="text-gray-600 pl-6">{consent.purpose}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Consent Granted</p>
                      <p className="font-medium text-gray-900">{formatDate(consent.grantedOn)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Retention Period</p>
                    <p className="font-bold text-gray-900">{consent.retention_months} months</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {consent.dataFlow?.length > 0 && (
                  <div className="p-4 bg-white rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      Data Sharing Partners
                    </h4>
                    <div className="flex flex-wrap gap-2 pl-6">
                      {consent.dataFlow.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-50/50 text-purple-700 border border-purple-100 hover:border-purple-200 transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Consent ID</h4>
                  <div className="flex items-center gap-3 pl-6">
                    <code className="text-xs px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-mono">
                      {consent._id}
                    </code>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
            <div className="relative">
              <div className="animate-spin h-10 w-10 border-2 border-blue-200 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin h-6 w-6 border-t-2 border-blue-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">Opening site settings...</p>
          </div>
        )}
      </div>
    </div>
  );
};

ConsentCard.propTypes = {
  consent: PropTypes.object.isRequired,
  delay: PropTypes.number,
  onStatusChange: PropTypes.func.isRequired,
};

export default ConsentCard;