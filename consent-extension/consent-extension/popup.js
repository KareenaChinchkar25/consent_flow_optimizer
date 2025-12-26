const listEl = document.getElementById('list');


async function loadRecent() {
chrome.runtime.sendMessage({ type: 'GET_LAST_CONSENTS' }, (resp) => {
if (!resp || !resp.data) return;
renderList(resp.data);
});
}


function renderList(items) {
listEl.innerHTML = '';
if (!items || items.length === 0) {
listEl.innerHTML = '<li class="muted">No consents captured yet</li>';
return;
}
items.slice(0, 20).forEach((c) => {
const li = document.createElement('li');
li.innerHTML = `<strong>${escapeHtml(c.website)}</strong> — ${escapeHtml(c.permission)} <br/><small>${escapeHtml(c.grantedOn)}</small>`;
listEl.appendChild(li);
});
}


function escapeHtml(s) {
return String(s).replace(/[&<>"'`]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[m]));
}


testBtn.addEventListener('click', async () => {
const test = {
consentId: 'test-' + Date.now(),
website: 'example.com',
platform: 'extension',
permission: 'Location',
category: 'Tracking',
purpose: 'Test consent',
grantedOn: new Date().toISOString(),
status: 'Granted',
dataFlow: JSON.stringify([]),
retention_months: 12,
consentString: 'test'
};



chrome.runtime.sendMessage({ type: 'FORCE_SEND_CONSENT', payload: test }, (resp) => {
// no-op
});
});



chrome.runtime.onMessage.addListener((msg) => {
if (msg && msg.type === 'CONSENT_STORED') {
loadRecent();
}
});


loadRecent();