const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");
const postGrid = document.querySelector("#post-grid");
const postCount = document.querySelector("#post-count");
const postsTitle = document.querySelector("#posts-title");
const emptyState = document.querySelector("#empty-state");
const topicButtons = [...document.querySelectorAll(".topic-pill")];

const posts = [
];

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

const particleColors = ["#4b7bff", "#20d6c7", "#ff7a4d", "#19c37d"];

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
  const velocity = (Math.random() * 2.1 + 0.35) * speed;

  particles.push({
    x,
    y,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity,
    radius: Math.random() * 1.4 + 0.7,
    life: 1,
    decay: Math.random() * 0.018 + 0.012,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
  });
}

function seedAmbientParticles() {
  const count = Math.min(Math.floor((width * height) / 36000), 30);
  for (let i = 0; i < count; i += 1) {
    createParticle(Math.random() * width, Math.random() * height, 0.2);
    particles[particles.length - 1].life = Math.random() * 0.45 + 0.18;
    particles[particles.length - 1].decay = 0.002;
  }
}

function emitTrail(x, y, px, py) {
  const dx = x - px;
  const dy = y - py;
  const distance = Math.hypot(dx, dy);
  const steps = Math.min(Math.max(Math.floor(distance / 12), 1), 10);

  for (let i = 0; i < steps; i += 1) {
    const t = i / steps;
    createParticle(
      px + dx * t + (Math.random() - 0.5) * 13,
      py + dy * t + (Math.random() - 0.5) * 13,
      0.62,
    );
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 86) {
        const opacity = (1 - distance / 86) * Math.min(a.life, b.life) * 0.22;
        ctx.strokeStyle = `rgba(75, 123, 255, ${opacity})`;
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

  if (!pointer.active && Math.random() < 0.08 && particles.length < 62) {
    createParticle(Math.random() * width, Math.random() * height, 0.16);
    particles[particles.length - 1].decay = 0.0028;
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
      particle.radius * 4,
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  window.requestAnimationFrame(animate);
}

function renderPosts(filter = "all") {
  const visiblePosts =
    filter === "all"
      ? posts
      : posts.filter((post) => post.tags.includes(filter));

  postGrid.innerHTML = visiblePosts
    .map(
      (post) => `
        <article class="post-card">
          <div class="post-cover" style="--cover: ${post.cover}">
            <span>${post.pinned ? "置顶" : post.tags[0]}</span>
          </div>
          <div class="post-body">
            <div class="post-meta">
              <span>发表于 ${post.date}</span>
              <span>更新于 ${post.updated}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <div class="tag-list">
              ${post.tags.map((tag) => `<span class="tag"># ${tag}</span>`).join("")}
            </div>
            ${
              post.url
                ? `<a class="read-link" href="${post.url}">阅读全文</a>`
                : ""
            }
          </div>
        </article>
      `,
    )
    .join("");

  postsTitle.textContent = filter === "all" ? "全部文章" : `${filter} 文章`;
  postCount.textContent = `${visiblePosts.length} 篇`;
  emptyState.hidden = visiblePosts.length > 0;
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

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    topicButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPosts(button.dataset.filter);
  });
});

window.addEventListener("resize", () => {
  resizeCanvas();
  particles = [];
  seedAmbientParticles();
});

window.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  pointer.moved = false;
  handlePointerMove(event);
  for (let i = 0; i < 5; i += 1) {
    createParticle(event.clientX, event.clientY, 0.72);
  }
});

window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", () => {
  pointer.active = false;
});
window.addEventListener("pointercancel", () => {
  pointer.active = false;
});

renderPosts();
resizeCanvas();
seedAmbientParticles();
animate();
