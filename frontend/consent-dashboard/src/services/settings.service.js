const API_URL = "http://localhost:4000/api/settings";

export const fetchSettings = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const saveSettings = async (settings) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });
  return res.json();
};
