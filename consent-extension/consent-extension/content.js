(function () {
  const PERMISSIONS = ["geolocation", "camera", "microphone"];
  const lastEvent = {};

  init();

  function init() {
    hookPermissionAPIs();
    watchPermissionState();
    registerNotificationListener();
  }

  

  function watchPermissionState() {
    if (!navigator.permissions?.query) return;

    PERMISSIONS.forEach(async (perm) => {
      try {
        const status = await navigator.permissions.query({ name: perm });
        status.onchange = () => {
          sendEvent({
            permission: perm,
            purpose: "Permission state changed",
            status: status.state === "granted" ? "Granted" : "Revoked",
          });
        };
      } catch {}
    });
  }

 

  function hookPermissionAPIs() {
    if (navigator.geolocation) {
      const originalGet = navigator.geolocation.getCurrentPosition;
      navigator.geolocation.getCurrentPosition = function (...args) {
        sendEvent({
          permission: "geolocation",
          purpose: "Website accessed location",
          status: "Granted",
        });
        return originalGet.apply(this, args);
      };
    }

    if (navigator.mediaDevices?.getUserMedia) {
      const original = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = function (constraints) {
        if (constraints?.audio) {
          sendEvent({
            permission: "microphone",
            purpose: "Website accessed microphone",
            status: "Granted",
          });
        }
        if (constraints?.video) {
          sendEvent({
            permission: "camera",
            purpose: "Website accessed camera",
            status: "Granted",
          });
        }
        return original.apply(this, arguments);
      };
    }
  }

  
  function sendEvent({ permission, purpose, status }) {
    const key = `${location.hostname}-${permission}-${status}-${purpose}`;
    if (lastEvent[key] && Date.now() - lastEvent[key] < 3000) return;
    lastEvent[key] = Date.now();

    chrome.runtime.sendMessage({
      type: "PERMISSION_DETECTED",
      website: location.hostname,
      url: location.href,
      platform: detectPlatform(),
      permission,
      category: detectCategory(permission),
      purpose,
      status,
      dataFlow: detectThirdParties(),
      retention_months: 12,
      grantedOn: new Date().toISOString(),
    });
  }

  

  function registerNotificationListener() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "SHOW_PERMISSION_NOTIFICATION") {
        showPermissionToast(msg.payload);
      }
    });
  }

  function showPermissionToast({ website, permission, risk_category, status }) {
  const existing = document.getElementById("consent-toast-root");
  if (existing) existing.remove();

  const root = document.createElement("div");
  root.id = "consent-toast-root";
  root.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    pointer-events: auto;
  `;

  const shadow = root.attachShadow({ mode: "open" });

  const color =
    risk_category === "High"
      ? "#dc2626"
      : risk_category === "Medium"
      ? "#d97706"
      : "#16a34a";

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.15);
    font-family: system-ui, sans-serif;
    max-width: 360px;
    border-left: 6px solid ${color};
  `;

  // ❌ BUTTON REMOVED
  toast.innerHTML = `
    <div style="font-weight:600">Permission ${status}</div>
    <div style="margin-top:4px;font-size:14px">
      ${permission} — <strong>${website}</strong>
    </div>
    <div style="margin-top:6px;font-size:13px;color:${color}">
      Risk Level: ${risk_category ?? "Analyzing"}
    </div>
  `;

  shadow.appendChild(toast);
  document.documentElement.appendChild(root);

  // Auto-remove toast after 6 seconds
  setTimeout(() => root.remove(), 6000);
}




  function detectPlatform() {
    const ua = navigator.userAgent;
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone")) return "iOS";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Firefox")) return "Firefox";
    return "Chrome";
  }

  function detectCategory(permission) {
    if (permission === "geolocation") return "Tracking";
    if (permission === "camera" || permission === "microphone")
      return "Device Access";
    return "Functional";
  }

  function detectThirdParties() {
    const trackers = [];
    if (document.querySelector('script[src*="google"]'))
      trackers.push("Google Analytics");
    if (document.querySelector('script[src*="facebook"]'))
      trackers.push("Meta Pixel");
    return trackers;
  }
})();
