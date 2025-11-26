(function () {
    console.log("Permission watcher active:", window.location.href);

    const watch = async (permName) => {
        try {
            const status = await navigator.permissions.query({ name: permName });

            console.log(`Watching permission: ${permName}, state=${status.state}`);

            status.onchange = () => {
                console.log(`⚡ Permission changed: ${permName} → ${status.state}`);

                if (status.state === "granted") {
                    sendPermissionEvent(permName, "User granted permission");
                }
            };
        } catch (err) {
            console.warn(`Permission ${permName} cannot be watched`, err);
        }
    };

    watch("geolocation");
    watch("camera");
    watch("microphone");
})();


function sendPermissionEvent(permissionType, purposeText) {
    const msg = {
        type: "PERMISSION_DETECTED",
        domain: location.hostname,
        permission_type: permissionType,
        platform: "Chrome",
        category: detectCategory(permissionType),
        purpose: purposeText,
        status: "Granted",
        dataFlow: [],
        retention_months: 12,
        grantedOn: new Date().toISOString(),
    };

    console.log(" Sending permission event:", msg);

    try {
        chrome.runtime.sendMessage(msg, () => {
            if (chrome.runtime.lastError) {
                console.warn("⚠️ SendMessage failed:", chrome.runtime.lastError.message);
            }
        });
    } catch (err) {
        console.warn("⚠️ Message send aborted (context invalidated)", err);
    }
}



function detectCategory(permission) {
    if (permission === "geolocation") return "Tracking";
    if (permission === "camera" || permission === "microphone") return "Device Access";
    return "Functional";
}
