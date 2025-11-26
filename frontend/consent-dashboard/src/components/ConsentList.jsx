import React from "react";
import ConsentCard from "./ConsentCard";
import { useConsent } from "../context/ConsentContext";

const ConsentList = () => {
  const { filteredConsents, updateConsentStatus } = useConsent();

  if (filteredConsents.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200 animate-fade-in">
        <div className="px-6 py-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No consents found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Consent Records ({filteredConsents.length})
        </h2>
      </div>

      <div className="grid gap-4 custom-scrollbar">
        {filteredConsents.map((consent, index) => (
          <ConsentCard
            key={
              consent.consentId ||
              `${consent.website}-${consent.permission}-${consent.grantedOn}-${index}`
            }
            consent={consent}
            delay={index * 100}
            onStatusChange={updateConsentStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsentList;
