export const API_BASE_URL = "http://localhost:5000/api";

export async function apiFetch(path, method = "GET", body = null) {
  const token = localStorage.getItem("token");  // ✅ get token saved after login

  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })  // ✅ add token
    }
  };

  if (body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, opts);

  if (!res.ok) {
    throw new Error(`API fetch failed`);
  }

  return await res.json();
}
