/* ------------------------- 🌍 CONFIG ------------------------- */
const API_BASE_URL = "https://finance-backend-d7ch.onrender.com/api";

/* ------------------------- 🔐 LOGIN FORM ------------------------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "⚠️ Invalid email or password");
        return;
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);

      alert("✅ Login successful!");

      // ✅ Redirect to dashboard (absolute path for safety)
      window.location.href = "/project/dashboard.html";
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Server error, please try again later.");
    }
  });
}

/* ------------------------- 🆕 SIGNUP FORM ------------------------- */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "⚠️ Registration failed");
        return;
      }

      // ✅ Auto-login after signup
      localStorage.setItem("token", data.token);
      alert("✅ Account created successfully! Redirecting to dashboard...");
      window.location.href = "/project/dashboard.html";
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert("Server error, please try again later.");
    }
  });
}

/* ------------------------- 🔐 GOOGLE LOGIN ------------------------- */
const googleLogin = document.getElementById("googleLogin");
if (googleLogin) {
  googleLogin.addEventListener("click", () => {
    // ✅ Redirect to backend Google OAuth route
    window.location.href = `${API_BASE_URL}/auth/google`;
  });
}

/* ------------------------- 🧠 HANDLE TOKEN FROM GOOGLE REDIRECT ------------------------- */
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");
if (tokenFromUrl) {
  localStorage.setItem("token", tokenFromUrl);
  window.history.replaceState({}, document.title, "/project/dashboard.html"); // clean URL
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
