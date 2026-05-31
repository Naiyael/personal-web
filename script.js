const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");
const postGrid = document.querySelector("#post-grid");
const postCount = document.querySelector("#post-count");
const postsTitle = document.querySelector("#posts-title");
const emptyState = document.querySelector("#empty-state");
const topicButtons = [...document.querySelectorAll(".topic-pill")];

const audioPlayer = document.querySelector("#audio-player");
const togglePlayButton = document.querySelector("#toggle-play");
const prevTrackButton = document.querySelector("#prev-track");
const nextTrackButton = document.querySelector("#next-track");
const musicTitle = document.querySelector("#music-title");
const musicArtist = document.querySelector("#music-artist");
const musicProgressBar = document.querySelector("#music-progress-bar");
const themeToggleButton = document.querySelector("#theme-toggle");
const skillGrid = document.querySelector(".skill-grid");

const posts = [
  {
    title: "The 2023 ICPC Asia Nanjing Regional Contest",
    date: "2026-05-31",
    updated: "2026-05-31",
    summary:
      "把 2023 南京区域赛里 Primitive Root、Knapsack、Counter 三篇 Markdown 题解合并成一篇比赛回顾文章。",
    tags: ["ICPC", "算法", "C++"],
    cover:
      "url('assets/icpc-burger.jpg') center center / cover no-repeat",
    pinned: true,
    url: "posts/2023-icpc-asia-nanjing-regional-contest.html",
  },
  {
    title: "ICPC省赛常用模板整理",
    date: "2026-05-27",
    updated: "2026-05-27",
    summary:
      "把省赛前高频会用到的 C++ 模板按图论、数据结构、DP、字符串和基础数学整理成一篇可直接检索的模板册。",
    tags: ["算法", "C++", "ICPC"],
    cover:
      "url('assets/icpc-burger.jpg') center center / cover no-repeat",
    pinned: true,
    url: "posts/icpc-provincial-templates.html",
  },
  {
    title: "线性 DP 和背包 DP 题目复盘",
    date: "2026-05-15",
    updated: "2026-05-15",
    summary:
      "整理线性 DP、状态机 DP、计数 DP 和背包 DP 的常见模型，按题目复盘状态定义、转移和易错点。",
    tags: ["算法", "C++", "DP"],
    cover:
      "url('assets/icpc-burger.jpg') center center / cover no-repeat",
    pinned: true,
    url: "posts/linear-backpack-dp-review.html",
  },
];

const tracks = [
  { title: "晴天", artist: "周杰伦", src: "music/晴天.mp3" },
  { title: "园游会", artist: "周杰伦", src: "music/园游会.mp3" },
  { title: "最长的电影", artist: "周杰伦", src: "music/最长的电影.mp3" },
];

let currentTrackIndex = 0;
let width = 0;
let height = 0;
let particles = [];
let pointer = { x: 0, y: 0, px: 0, py: 0, active: false, moved: false };
let skillScrollOffset = 0;
let skillMarqueeFrame = null;

const particleColors = ["#4f74ff", "#25c7d9", "#ff8a4c", "#28c78a"];

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("site-theme", theme);
  if (themeToggleButton) {
    themeToggleButton.textContent = theme === "dark" ? "☼" : "◐";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("site-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
}

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
  const velocity = (Math.random() * 1.8 + 0.28) * speed;
  particles.push({
    x,
    y,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity,
    radius: Math.random() * 1.2 + 0.6,
    life: 1,
    decay: Math.random() * 0.016 + 0.012,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
  });
}

function seedAmbientParticles() {
  const count = Math.min(Math.floor((width * height) / 46000), 24);
  for (let i = 0; i < count; i += 1) {
    createParticle(Math.random() * width, Math.random() * height, 0.18);
    particles[particles.length - 1].life = Math.random() * 0.42 + 0.16;
    particles[particles.length - 1].decay = 0.002;
  }
}

function emitTrail(x, y, px, py) {
  const dx = x - px;
  const dy = y - py;
  const distance = Math.hypot(dx, dy);
  const steps = Math.min(Math.max(Math.floor(distance / 18), 1), 6);
  for (let i = 0; i < steps; i += 1) {
    const t = i / steps;
    createParticle(
      px + dx * t + (Math.random() - 0.5) * 10,
      py + dy * t + (Math.random() - 0.5) * 10,
      0.5,
    );
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 76) {
        const opacity = (1 - distance / 76) * Math.min(a.life, b.life) * 0.18;
        ctx.strokeStyle = `rgba(79, 116, 255, ${opacity})`;
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
  if (!pointer.active && Math.random() < 0.06 && particles.length < 48) {
    createParticle(Math.random() * width, Math.random() * height, 0.14);
    particles[particles.length - 1].decay = 0.0026;
  }
  drawConnections();
  particles = particles.filter((particle) => particle.life > 0.02);
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy *= 0.985;
    particle.life -= particle.decay;
    const radius = particle.radius * 3.5;
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      radius,
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
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
            ${post.url ? `<a class="read-link" href="${post.url}">阅读全文</a>` : ""}
          </div>
        </article>
      `,
    )
    .join("");
  postsTitle.textContent = filter === "all" ? "全部文章" : `${filter} 文章`;
  postCount.textContent = `${visiblePosts.length} 篇`;
  const hasPosts = visiblePosts.length > 0;
  emptyState.hidden = hasPosts;
  emptyState.setAttribute("aria-hidden", String(hasPosts));
}

function loadTrack(index) {
  if (tracks.length === 0) {
    audioPlayer.removeAttribute("src");
    togglePlayButton.disabled = true;
    prevTrackButton.disabled = true;
    nextTrackButton.disabled = true;
    musicProgressBar.style.width = "0";
    return;
  }
  currentTrackIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrackIndex];
  audioPlayer.src = track.src;
  musicTitle.textContent = track.title;
  musicArtist.textContent = track.artist;
  musicProgressBar.style.width = "0";
  togglePlayButton.disabled = false;
  togglePlayButton.textContent = "Play";
  prevTrackButton.disabled = tracks.length < 2;
  nextTrackButton.disabled = tracks.length < 2;
}

async function togglePlay() {
  if (tracks.length === 0) return;
  if (audioPlayer.paused) {
    await audioPlayer.play();
    togglePlayButton.textContent = "Pause";
  } else {
    audioPlayer.pause();
    togglePlayButton.textContent = "Play";
  }
}

async function playTrack(index) {
  loadTrack(index);
  await audioPlayer.play();
  togglePlayButton.textContent = "Pause";
}

function handlePointerMove(event) {
  pointer.px = pointer.moved ? pointer.x : event.clientX;
  pointer.py = pointer.moved ? pointer.y : event.clientY;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.moved = true;
  if (pointer.active) emitTrail(pointer.x, pointer.y, pointer.px, pointer.py);
}

function getSkillScrollSpeed() {
  if (window.innerWidth <= 720) return 0.32;
  if (window.innerWidth <= 1040) return 0.4;
  return 0.5;
}

function syncSkillMarquee() {
  if (!skillGrid || skillGrid.children.length === 0) return;
  const firstCard = skillGrid.firstElementChild;
  if (!firstCard) return;

  const gap = parseFloat(window.getComputedStyle(skillGrid).gap || "0");
  const firstCardWidth = firstCard.getBoundingClientRect().width + gap;

  skillScrollOffset += getSkillScrollSpeed();
  while (skillScrollOffset >= firstCardWidth && skillGrid.firstElementChild) {
    skillScrollOffset -= firstCardWidth;
    skillGrid.appendChild(skillGrid.firstElementChild);
  }

  skillGrid.style.transform = `translateX(-${skillScrollOffset}px)`;
  skillMarqueeFrame = window.requestAnimationFrame(syncSkillMarquee);
}

function initSkillMarquee() {
  if (!skillGrid || skillGrid.children.length === 0) return;
  skillScrollOffset = 0;
  skillGrid.style.transform = "translateX(0)";
  if (skillMarqueeFrame) {
    window.cancelAnimationFrame(skillMarqueeFrame);
  }
  skillMarqueeFrame = window.requestAnimationFrame(syncSkillMarquee);
}

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    topicButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPosts(button.dataset.filter);
  });
});

togglePlayButton.addEventListener("click", togglePlay);
prevTrackButton.addEventListener("click", () => playTrack(currentTrackIndex - 1));
nextTrackButton.addEventListener("click", () => playTrack(currentTrackIndex + 1));
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}
audioPlayer.addEventListener("timeupdate", () => {
  const progress = audioPlayer.duration
    ? (audioPlayer.currentTime / audioPlayer.duration) * 100
    : 0;
  musicProgressBar.style.width = `${progress}%`;
});
audioPlayer.addEventListener("ended", () => {
  if (tracks.length > 1) playTrack(currentTrackIndex + 1);
  else togglePlayButton.textContent = "Play";
});
window.addEventListener("resize", () => {
  resizeCanvas();
  particles = [];
  seedAmbientParticles();
  initSkillMarquee();
});
window.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  pointer.moved = false;
  handlePointerMove(event);
  for (let i = 0; i < 4; i += 1) createParticle(event.clientX, event.clientY, 0.58);
});
window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", () => {
  pointer.active = false;
});
window.addEventListener("pointercancel", () => {
  pointer.active = false;
});

initTheme();
initSkillMarquee();
renderPosts();
loadTrack(0);
resizeCanvas();
seedAmbientParticles();
animate();
