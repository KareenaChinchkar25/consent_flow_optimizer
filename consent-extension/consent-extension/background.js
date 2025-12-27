

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function generateStableConsentId(domain, permission) {
  return `${domain}::${permission}`;
}

function notifyTab(tabId, payload) {
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, {
    type: "SHOW_PERMISSION_NOTIFICATION",
    payload,
  });
}



function convertToMLFormat(raw) {
  const domain = raw.domain || extractDomain(raw.url);
  const permission = raw.permission_type || raw.permission || "unknown";

  return {
    consentId: generateStableConsentId(domain, permission),
    website: domain,
    fullUrl: raw.url || null,

    platform: raw.platform || "Chrome",

    permission,
    category: raw.category || "General",
    purpose: raw.purpose || "Permission requested",
    status: raw.status || "Granted",

    dataFlow: Array.isArray(raw.dataFlow) ? raw.dataFlow : [],
    retention_months: Number(raw.retention_months) || 12,
    grantedOn: raw.grantedOn || new Date().toISOString(),
  };
}



const sentConsents = new Set();
const MAX_CACHE_SIZE = 500;



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
 
  if (msg.type === "PERMISSION_DETECTED") {
    const formatted = convertToMLFormat(msg);
    const eventKey = `${formatted.consentId}::${formatted.status}`;

    if (sentConsents.has(eventKey)) {
      sendResponse({ skipped: true });
      return true;
    }

    sentConsents.add(eventKey);
    if (sentConsents.size > MAX_CACHE_SIZE) {
      sentConsents.clear();
    }

    fetch("http://localhost:4000/consents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatted),
    })
      .then(async (res) => {
        let riskCategory = "Analyzing";

        try {
          if (res.headers.get("content-type")?.includes("application/json")) {
            const data = await res.json();
            if (data?.risk_category) {
              riskCategory = data.risk_category;
            }
          }
        } catch {}

        notifyTab(sender.tab?.id, {
          website: formatted.website,
          permission: formatted.permission,
          status: formatted.status,
          risk_category: riskCategory,
        });

        sendResponse({ received: true });
      })
      .catch(() => {
        sendResponse({ received: false });
      });

    return true;
  }

  
  if (msg.type === "OPEN_URL" && msg.url) {
    chrome.tabs.create({ url: msg.url });
    sendResponse({ opened: true });
    return true;
  }
});



chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  console.log("External message received:", msg);
  if (msg.type === "OPEN_SITE_SETTINGS" && msg.site) {
    try {
      // ✅ FORCE origin parsing (this is the key)
      const origin = new URL(msg.site).origin;
      const encoded = encodeURIComponent(origin);

      const url =
        `chrome://settings/content/siteDetails?site=${encoded}`;

      chrome.tabs.create({ url });

      sendResponse({ opened: true });
    } catch (e) {
      console.error("Invalid site for settings:", msg.site);
      sendResponse({ opened: false });
    }
    return true;
  }
});


