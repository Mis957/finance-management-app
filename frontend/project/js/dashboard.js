/* ------------------------- 🌍 CONFIG ------------------------- */
const API_BASE_URL = "http://localhost:5000/api";

/* ------------------------- 🔒 AUTH CHECK ------------------------- */
async function checkAuth() {
  const token = localStorage.getItem("token");

  // ❌ If no token → redirect to login
  if (!token) {
    window.location.href = "/project/login/login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ❌ If token invalid → remove it and go to login
    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/project/login/login.html";
      return;
    }

    // ✅ Token valid → show user info
    const user = await res.json();
    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser) {
      welcomeUser.innerText = `Welcome, ${user.name} 👋`;
    }

  } catch (err) {
    console.error("❌ Auth check failed:", err);
    localStorage.removeItem("token");
    window.location.href = "/project/login/login.html";
  }
}

/* ------------------------- 🚪 LOGOUT ------------------------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("👋 Logged out successfully!");
    window.location.href = "/project/login/login.html";
  });
}

/* ------------------------- 🚀 RUN ------------------------- */
checkAuth();
