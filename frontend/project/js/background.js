// js/background.js
document.addEventListener("DOMContentLoaded", () => {
  const galaxyCanvas = document.getElementById("galaxy-bg");
  const lightBg = document.getElementById("light-icons-bg");
  const ctx = galaxyCanvas.getContext("2d");

  function resizeCanvas() {
    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // === Galaxy animation (for dark mode) ===
  const stars = Array.from({ length: 250 }).map(() => ({
    x: Math.random() * galaxyCanvas.width,
    y: Math.random() * galaxyCanvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.8 + 0.2
  }));

  function drawGalaxy() {
    ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
    const gradient = ctx.createRadialGradient(
      galaxyCanvas.width / 2,
      galaxyCanvas.height / 2,
      0,
      galaxyCanvas.width / 2,
      galaxyCanvas.height / 2,
      galaxyCanvas.width / 1.2
    );
    gradient.addColorStop(0, "#1e0e35");
    gradient.addColorStop(1, "#070328");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > galaxyCanvas.height) s.y = -2;
    }
    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();

  // === Light mode floating doodles ===
  const iconSvgs = [
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18v12H3z"/><path d="M16 10a2 2 0 100 4 2 2 0 000-4z"/></svg>`, // wallet
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>`, // coin
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M4 10h16"/><path d="M9 14h6"/></svg>`, // card
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1v22M4 5l8-4 8 4M4 19l8 4 8-4"/></svg>` // stack
  ];

  function createLightIcons() {
    for (let i = 0; i < 20; i++) {
      const icon = document.createElement("div");
      icon.innerHTML = iconSvgs[Math.floor(Math.random() * iconSvgs.length)];
      const svg = icon.querySelector("svg");
      svg.style.width = 24 + Math.random() * 18 + "px";
      svg.style.position = "absolute";
      svg.style.left = Math.random() * 100 + "%";
      svg.style.bottom = "-40px";
      svg.style.opacity = Math.random() * 0.8 + 0.2;
      svg.style.animation = `floatUp ${10 + Math.random() * 10}s linear infinite`;
      svg.style.animationDelay = Math.random() * 8 + "s";
      lightBg.appendChild(svg);
    }
  }
  createLightIcons();

  // === Update visibility when theme changes ===
  const observer = new MutationObserver(updateMode);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  updateMode();

  function updateMode() {
    const dark = document.body.classList.contains("dark");
    galaxyCanvas.style.display = dark ? "block" : "none";
    lightBg.style.display = dark ? "none" : "block";
  }
});
