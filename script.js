const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let pointer = {
  x: 0,
  y: 0,
  px: 0,
  py: 0,
  active: false,
  moved: false,
};

const colors = ["#54d6e8", "#7ee787", "#f1c46b", "#f38ba8"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticle(x, y, speed = 1) {
  const angle = Math.random() * Math.PI * 2;
  const velocity = (Math.random() * 2.4 + 0.4) * speed;

  particles.push({
    x,
    y,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity,
    radius: Math.random() * 2.6 + 1,
    life: 1,
    decay: Math.random() * 0.018 + 0.012,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
}

function seedAmbientParticles() {
  const count = Math.min(Math.floor((width * height) / 28000), 42);
  for (let i = 0; i < count; i += 1) {
    createParticle(Math.random() * width, Math.random() * height, 0.25);
    particles[particles.length - 1].life = Math.random() * 0.55 + 0.18;
    particles[particles.length - 1].decay = 0.0025;
  }
}

function emitTrail(x, y, px, py) {
  const dx = x - px;
  const dy = y - py;
  const distance = Math.hypot(dx, dy);
  const steps = Math.min(Math.max(Math.floor(distance / 12), 1), 10);

  for (let i = 0; i < steps; i += 1) {
    const t = i / steps;
    const jitterX = (Math.random() - 0.5) * 14;
    const jitterY = (Math.random() - 0.5) * 14;
    createParticle(px + dx * t + jitterX, py + dy * t + jitterY, 1.2);
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 92) {
        const opacity = (1 - distance / 92) * Math.min(a.life, b.life) * 0.24;
        ctx.strokeStyle = `rgba(84, 214, 232, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  if (!pointer.active && Math.random() < 0.12 && particles.length < 80) {
    createParticle(Math.random() * width, Math.random() * height, 0.18);
    particles[particles.length - 1].decay = 0.003;
  }

  drawConnections();

  particles = particles.filter((particle) => particle.life > 0.02);

  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy *= 0.985;
    particle.life -= particle.decay;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 6,
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, "rgba(8, 11, 16, 0)");

    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  window.requestAnimationFrame(animate);
}

function handlePointerMove(event) {
  pointer.px = pointer.moved ? pointer.x : event.clientX;
  pointer.py = pointer.moved ? pointer.y : event.clientY;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.moved = true;

  if (pointer.active) {
    emitTrail(pointer.x, pointer.y, pointer.px, pointer.py);
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  particles = [];
  seedAmbientParticles();
});

window.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  pointer.moved = false;
  handlePointerMove(event);
  for (let i = 0; i < 14; i += 1) {
    createParticle(event.clientX, event.clientY, 1.4);
  }
});

window.addEventListener("pointermove", handlePointerMove);

window.addEventListener("pointerup", () => {
  pointer.active = false;
});

window.addEventListener("pointercancel", () => {
  pointer.active = false;
});

resizeCanvas();
seedAmbientParticles();
animate();
