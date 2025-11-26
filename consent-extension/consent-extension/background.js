function convertToMLFormat(raw) {
    return {
        website: raw.domain,
        platform: raw.platform,
        permission: raw.permission_type,
        category: raw.category,
        purpose: raw.purpose,
        status: raw.status,                  
        dataFlow: raw.dataFlow || [],
        retention_months: raw.retention_months || 12,
        grantedOn: raw.grantedOn || raw.timestamp || new Date().toISOString(),
    };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("📩 Background received message:", msg);

    if (msg.type === "PERMISSION_DETECTED") {
        const formatted = convertToMLFormat(msg);

        fetch("http://127.0.0.1:8000/add-consent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formatted)
        })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} - ${text}`);
            }
            console.log("✅ Consent successfully sent to backend!");
        })
        .catch(err => console.error("❌ Failed to send consent:", err));

        sendResponse({ received: true });
        return true;
    }

    sendResponse({ ok: true });
});
