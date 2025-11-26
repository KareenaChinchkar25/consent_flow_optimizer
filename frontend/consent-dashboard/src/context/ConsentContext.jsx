import React, { createContext, useContext, useReducer, useEffect } from "react";
import { consentService } from "../services/api";

const ConsentContext = createContext();

const initialState = {
  consents: [],
  loading: false,
  error: null,
  filters: {
    riskLevel: "all",
    status: "all",
    search: "",
  },
  stats: {
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  },
  lastUpdated: null,
};

// ---------------------------------------------
// REDUCER
// ---------------------------------------------
function consentReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_CONSENTS":
      return {
        ...state,
        consents: action.payload.consents,
        lastUpdated: new Date().toISOString(),
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "UPDATE_STATS":
      return { ...state, stats: action.payload };

    case "UPDATE_CONSENT_STATUS":
      return {
        ...state,
        consents: state.consents.map((c) =>
          c.consentId === action.payload.consentId
            ? { ...c, status: action.payload.newStatus }
            : c
        ),
      };

    default:
      return state;
  }
}

// ---------------------------------------------
// FILTERING
// ---------------------------------------------
function getFilteredConsents(state) {
  const { consents, filters } = state;

  return consents.filter((c) => {
    const matchRisk =
      filters.riskLevel === "all" || c.risk_category === filters.riskLevel;

    const matchStatus =
      filters.status === "all" || c.status === filters.status;

    const matchSearch =
      filters.search === "" ||
      c.website?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.permission?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.category?.toLowerCase().includes(filters.search.toLowerCase());

    return matchRisk && matchStatus && matchSearch;
  });
}

// ---------------------------------------------
const updateConsentStatus = (consentId, newStatus) => {};
// ---------------------------------------------


export function ConsentProvider({ children }) {
  const [state, dispatch] = useReducer(consentReducer, initialState);

  // ---------------------------------------------------------
  // FETCH LATEST CONSENTS WITH ML PREDICTIONS
  // ---------------------------------------------------------
  const fetchConsents = async () => {
  try {
    const data = await consentService.getConsents();

    // Accept both formats safely
    const consents = Array.isArray(data)
      ? data
      : data?.predictions || [];

    dispatch({
      type: "SET_CONSENTS",
      payload: { consents },
    });

    calculateStats(consents);
  } catch (error) {
    dispatch({
      type: "SET_ERROR",
      payload: error.message,
    });
  }
};


  // ---------------------------------------------------------
  // CALCULATE DASHBOARD STATS
  // ---------------------------------------------------------
  const calculateStats = (consents) => {
    dispatch({
      type: "UPDATE_STATS",
      payload: {
        total: consents.length,
        highRisk: consents.filter((c) => c.risk_category === "High").length,
        mediumRisk: consents.filter((c) => c.risk_category === "Medium").length,
        lowRisk: consents.filter((c) => c.risk_category === "Low").length,
      },
    });
  };

  // ---------------------------------------------------------
  // REAL-TIME REFRESH EVERY 3 SECONDS
  // ---------------------------------------------------------
  useEffect(() => {
    fetchConsents();
    const interval = setInterval(fetchConsents, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        ...state,
        filteredConsents: getFilteredConsents(state),
        updateFilters: (f) => dispatch({ type: "SET_FILTERS", payload: f }),
        updateConsentStatus,
        fetchConsents,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
};
