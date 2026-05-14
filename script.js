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

const posts = [];

const tracks = [
  {
<<<<<<< Updated upstream
    title: "晴天",
    artist: "周杰伦",
    src: "music/晴天.mp3",
  },
  {
    title: "园游会",
    artist: "周杰伦",
    src: "music/园游会.mp3",
  },
  {
    title: "最长的电影",
    artist: "周杰伦",
    src: "music/最长的电影.mp3",
=======
    title: "太阳之子",
    artist: "周杰伦 · 官方平台收听",
    officialUrl: "https://music.apple.com/us/song/1887230875?l=zh-Hans-CN",
>>>>>>> Stashed changes
  },
];

let currentTrackIndex = 0;
let width = 0;
let height = 0;
let particles = [];
let pointer = { x: 0, y: 0, px: 0, py: 0, active: false, moved: false };

const particleColors = ["#4f74ff", "#25c7d9", "#ff8a4c", "#28c78a"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticle(x, y, speed) {
  if (speed === undefined) speed = 1;
  const angle = Math.random() * Math.PI * 2;
  const velocity = (Math.random() * 1.8 + 0.28) * speed;
  particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, radius: Math.random() * 1.2 + 0.6, life: 1, decay: Math.random() * 0.016 + 0.012, color: particleColors[Math.floor(Math.random() * particleColors.length)] });
}

function seedAmbientParticles() {
  const count = Math.min(Math.floor((width * height) / 46000), 24);
  for (let i = 0; i < count; i++) {
    createParticle(Math.random() * width, Math.random() * height, 0.18);
    particles[particles.length - 1].life = Math.random() * 0.42 + 0.16;
    particles[particles.length - 1].decay = 0.002;
  }
}

function emitTrail(x, y, px, py) {
  const dx = x - px; const dy = y - py;
  const distance = Math.hypot(dx, dy);
  const steps = Math.min(Math.max(Math.floor(distance / 18), 1), 6);
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    createParticle(px + dx * t + (Math.random() - 0.5) * 10, py + dy * t + (Math.random() - 0.5) * 10, 0.5);
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 76) {
        const opacity = (1 - distance / 76) * Math.min(a.life, b.life) * 0.18;
        ctx.strokeStyle = "rgba(79, 116, 255, " + opacity + ")";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
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
  particles = particles.filter(function(p) { return p.life > 0.02; });
  for (var pi = 0; pi < particles.length; pi++) {
    var p = particles[pi];
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.985; p.vy *= 0.985;
    p.life -= p.decay;
    var radius = p.radius * 3.5;
    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  window.requestAnimationFrame(animate);
}

<<<<<<< Updated upstream
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
  // 不提前设置 audio src，等用户点击播放时再加载
  // 避免 mp3 文件未就绪时 audio 元素卡死在错误状态
  disc.classList.remove("spinning");
  musicTitle.textContent = track.title;
  musicArtist.textContent = track.artist;
  document.querySelector("#music-current").textContent = "0:00";
  document.querySelector("#music-duration").textContent = "0:00";
  togglePlayButton.disabled = false;
  togglePlayButton.textContent = track.src ? "播放" : "官方收听";
  prevTrackButton.disabled = tracks.length < 2;
  nextTrackButton.disabled = tracks.length < 2;
=======
function renderPosts(filter) {
  if (filter === undefined) filter = "all";
  var visible = filter === "all" ? posts : posts.filter(function(p) { return p.tags.indexOf(filter) !== -1; });
  var html = "";
  for (var i = 0; i < visible.length; i++) {
    var post = visible[i];
    html += '<article class="post-card"><div class="post-cover" style="--cover: ' + post.cover + '"><span>' + (post.pinned ? "置顶" : post.tags[0]) + '</span></div><div class="post-body"><div class="post-meta"><span>发表于 ' + post.date + '</span><span>更新于 ' + post.updated + '</span></div><h3>' + post.title + '</h3><p>' + post.summary + '</p><div class="tag-list">';
    for (var j = 0; j < post.tags.length; j++) html += '<span class="tag"># ' + post.tags[j] + '</span>';
    html += '</div>';
    if (post.url) html += '<a class="read-link" href="' + post.url + '">阅读全文</a>';
    html += '</div></article>';
  }
  postGrid.innerHTML = html;
  postsTitle.textContent = filter === "all" ? "全部文章" : filter + " 文章";
  postCount.textContent = visible.length + " 篇";
  emptyState.hidden = visible.length > 0;
>>>>>>> Stashed changes
}

function loadTrack(index) {
  if (tracks.length === 0) { audioPlayer.removeAttribute("src"); togglePlayButton.disabled = true; prevTrackButton.disabled = true; nextTrackButton.disabled = true; musicProgressBar.style.width = "0"; return; }
  currentTrackIndex = (index + tracks.length) % tracks.length;
  var track = tracks[currentTrackIndex];
  if (track.src) audioPlayer.src = track.src; else audioPlayer.removeAttribute("src");
  musicTitle.textContent = track.title;
  musicArtist.textContent = track.artist;
  togglePlayButton.disabled = false;
  togglePlayButton.textContent = track.src ? "播放" : "官方收听";
  prevTrackButton.disabled = tracks.length < 2;
  nextTrackButton.disabled = tracks.length < 2;
}

<<<<<<< Updated upstream
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    applyTheme(true);
  }
}

themeToggle.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark-mode"));
});

initTheme();

/* ===== Footer Year ===== */
document.querySelector("#footer-year").textContent = String(new Date().getFullYear());

/* ===== Scroll Animation ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".fade-section").forEach((el) => observer.observe(el));

/* ===== Music Player ===== */
const disc = document.querySelector(".disc");

async function togglePlay() {
  if (tracks.length === 0) return;

  const track = tracks[currentTrackIndex];

  // 外部链接跳转
  if (!track.src && track.officialUrl) {
    window.open(track.officialUrl, "_blank", "noopener,noreferrer");
    return;
  }

  if (!track.src) return;

  if (audioPlayer.paused) {
    try {
      // 每次点击播放都重新设置 src 并加载，确保 audio 处于干净状态
      audioPlayer.src = track.src;
      audioPlayer.load();
      await audioPlayer.play();
      togglePlayButton.textContent = "暂停";
      disc.classList.add("spinning");
    } catch (err) {
      console.warn("播放失败:", err);
      togglePlayButton.textContent = "播放";
      disc.classList.remove("spinning");
    }
  } else {
    audioPlayer.pause();
    togglePlayButton.textContent = "播放";
    disc.classList.remove("spinning");
  }
=======
async function togglePlay() {
  if (tracks.length === 0) return;
  var track = tracks[currentTrackIndex];
  if (!track.src && track.officialUrl) { window.open(track.officialUrl, "_blank", "noopener,noreferrer"); return; }
  if (audioPlayer.paused) { await audioPlayer.play(); togglePlayButton.textContent = "暂停"; }
  else { audioPlayer.pause(); togglePlayButton.textContent = "播放"; }
>>>>>>> Stashed changes
}

function playTrack(index) {
  loadTrack(index);
<<<<<<< Updated upstream
  const track = tracks[currentTrackIndex];
  if (!track.src) return;
  audioPlayer.src = track.src;
  audioPlayer.load();
  audioPlayer.play()
    .then(() => {
      togglePlayButton.textContent = "暂停";
      disc.classList.add("spinning");
    })
    .catch(() => {
      togglePlayButton.textContent = "播放";
      disc.classList.remove("spinning");
    });
}

/* 加载/播放失败时重置 UI */
audioPlayer.addEventListener("error", () => {
  togglePlayButton.textContent = "播放";
  disc.classList.remove("spinning");
});
=======
  if (!tracks[currentTrackIndex].src) return;
  audioPlayer.play();
  togglePlayButton.textContent = "暂停";
}
>>>>>>> Stashed changes

function handlePointerMove(event) {
  pointer.px = pointer.moved ? pointer.x : event.clientX;
  pointer.py = pointer.moved ? pointer.y : event.clientY;
  pointer.x = event.clientX; pointer.y = event.clientY;
  pointer.moved = true;
  if (pointer.active) emitTrail(pointer.x, pointer.y, pointer.px, pointer.py);
}

for (var bi = 0; bi < topicButtons.length; bi++) {
  topicButtons[bi].addEventListener("click", function() {
    for (var bj = 0; bj < topicButtons.length; bj++) topicButtons[bj].classList.remove("is-active");
    this.classList.add("is-active");
    renderPosts(this.dataset.filter);
  });
}

togglePlayButton.addEventListener("click", togglePlay);
<<<<<<< Updated upstream
prevTrackButton.addEventListener("click", () => {
  playTrack(currentTrackIndex - 1);
});
nextTrackButton.addEventListener("click", () => {
  playTrack(currentTrackIndex + 1);
});
function formatTime(seconds) {
  if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const musicTimeDisplay = document.createElement("div");
musicTimeDisplay.className = "music-time";
musicTimeDisplay.innerHTML = '<span id="music-current">0:00</span><span id="music-duration">0:00</span>';
document.querySelector(".music-info").after(musicTimeDisplay);

audioPlayer.addEventListener("timeupdate", () => {
  const progress = audioPlayer.duration
    ? (audioPlayer.currentTime / audioPlayer.duration) * 100
    : 0;
  musicProgressBar.style.width = `${progress}%`;
  document.querySelector("#music-current").textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", () => {
  document.querySelector("#music-duration").textContent = formatTime(audioPlayer.duration);
});
audioPlayer.addEventListener("ended", () => {
  disc.classList.remove("spinning");
  if (tracks.length > 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    togglePlayButton.textContent = "播放";
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  particles = [];
  seedAmbientParticles();
=======
prevTrackButton.addEventListener("click", function() { playTrack(currentTrackIndex - 1); });
nextTrackButton.addEventListener("click", function() { playTrack(currentTrackIndex + 1); });
audioPlayer.addEventListener("timeupdate", function() {
  musicProgressBar.style.width = (audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0) + "%";
>>>>>>> Stashed changes
});
audioPlayer.addEventListener("ended", function() {
  if (tracks.length > 1) playTrack(currentTrackIndex + 1);
  else togglePlayButton.textContent = "播放";
});
window.addEventListener("resize", function() { resizeCanvas(); particles = []; seedAmbientParticles(); });
window.addEventListener("pointerdown", function(event) {
  pointer.active = true; pointer.moved = false; handlePointerMove(event);
  for (var i = 0; i < 4; i++) createParticle(event.clientX, event.clientY, 0.58);
});
window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", function() { pointer.active = false; });
window.addEventListener("pointercancel", function() { pointer.active = false; });

renderPosts();
loadTrack(0);
resizeCanvas();
seedAmbientParticles();
animate();
