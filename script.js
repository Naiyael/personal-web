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
    title: "太阳之子",
    artist: "周杰伦 · 官方平台收听",
    officialUrl: "https://music.apple.com/us/song/1887230875?l=zh-Hans-CN",
  },
  // 本地音乐示例：
  // {
  //   title: "歌曲名",
  //   artist: "歌手或备注",
  //   src: "music/song.mp3",
  // },
];

let currentTrackIndex = 0;
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

const particleColors = ["#4f74ff", "#25c7d9", "#ff8a4c", "#28c78a"];

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
  if (track.src) {
    audioPlayer.src = track.src;
  } else {
    audioPlayer.removeAttribute("src");
  }
  musicTitle.textContent = track.title;
  musicArtist.textContent = track.artist;
  togglePlayButton.disabled = false;
  togglePlayButton.textContent = track.src ? "播放" : "官方收听";
  prevTrackButton.disabled = tracks.length < 2;
  nextTrackButton.disabled = tracks.length < 2;
}

async function togglePlay() {
  if (tracks.length === 0) {
    return;
  }

  const track = tracks[currentTrackIndex];
  if (!track.src && track.officialUrl) {
    window.open(track.officialUrl, "_blank", "noopener,noreferrer");
    return;
  }

  if (audioPlayer.paused) {
    await audioPlayer.play();
    togglePlayButton.textContent = "暂停";
  } else {
    audioPlayer.pause();
    togglePlayButton.textContent = "播放";
  }
}

function playTrack(index) {
  loadTrack(index);
  if (!tracks[currentTrackIndex].src) {
    return;
  }
  audioPlayer.play();
  togglePlayButton.textContent = "暂停";
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

togglePlayButton.addEventListener("click", togglePlay);
prevTrackButton.addEventListener("click", () => {
  playTrack(currentTrackIndex - 1);
});
nextTrackButton.addEventListener("click", () => {
  playTrack(currentTrackIndex + 1);
});
audioPlayer.addEventListener("timeupdate", () => {
  const progress = audioPlayer.duration
    ? (audioPlayer.currentTime / audioPlayer.duration) * 100
    : 0;
  musicProgressBar.style.width = `${progress}%`;
});
audioPlayer.addEventListener("ended", () => {
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
});

window.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  pointer.moved = false;
  handlePointerMove(event);
  for (let i = 0; i < 4; i += 1) {
    createParticle(event.clientX, event.clientY, 0.58);
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
loadTrack(0);
resizeCanvas();
seedAmbientParticles();
animate();
