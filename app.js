// app.js
// ------------------------
// Initialize Supabase
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";
const supabase = supabase.createClient
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : createClient(SUPABASE_URL, SUPABASE_KEY); // fallback if supabase already included globally

// ------------------------
// STATE
let user = null; // current logged-in user or null for guest
let songs = [];
let likedSongs = new Set();
let following = new Set();
let currentSongIndex = 0;
let isPlaying = false;

// ------------------------
// DOM Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const guestBtn = document.getElementById("guest-btn");
const logoutBtn = document.getElementById("logout-btn");
const songList = document.getElementById("song-list");
const likeList = document.getElementById("like-list");
const followList = document.getElementById("follow-list");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

// ------------------------
// AUTH FUNCTIONS
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  user = data.user;
  updateUI();
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  user = data.user;
  await loadUserData();
  updateUI();
}

async function signOut() {
  await supabase.auth.signOut();
  user = null;
  likedSongs.clear();
  following.clear();
  updateUI();
}

async function loadUserData() {
  if (!user) return;
  // Load liked songs
  let { data: liked, error } = await supabase
    .from("likes")
    .select("song_id")
    .eq("user_id", user.id);
  if (!error) liked.forEach(l => likedSongs.add(l.song_id));

  // Load followed artists
  let { data: follows, error: fErr } = await supabase
    .from("follows")
    .select("artist_id")
    .eq("user_id", user.id);
  if (!fErr) follows.forEach(f => following.add(f.artist_id));
}

// ------------------------
// SONG FUNCTIONS
async function loadSongs() {
  const { data, error } = await supabase.from("songs").select("*").order("id");
  if (error) return console.error(error);
  songs = data;
  renderSongs();
}

function renderSongs() {
  if (!songList) return;
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song-item";
    div.innerHTML = `
      <span>${song.title} - ${song.artist}</span>
      <button class="like-btn">${likedSongs.has(song.id) ? "♥" : "♡"}</button>
      <button class="follow-btn">${following.has(song.artist_id) ? "Following" : "Follow"}</button>
    `;
    div.querySelector(".like-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!user) return alert("Login to like songs");
      if (likedSongs.has(song.id)) {
        await supabase.from("likes").delete().match({ user_id: user.id, song_id: song.id });
        likedSongs.delete(song.id);
      } else {
        await supabase.from("likes").insert({ user_id: user.id, song_id: song.id });
        likedSongs.add(song.id);
      }
      renderSongs();
    });
    div.querySelector(".follow-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!user) return alert("Login to follow artists");
      if (following.has(song.artist_id)) {
        await supabase.from("follows").delete().match({ user_id: user.id, artist_id: song.artist_id });
        following.delete(song.artist_id);
      } else {
        await supabase.from("follows").insert({ user_id: user.id, artist_id: song.artist_id });
        following.add(song.artist_id);
      }
      renderSongs();
    });
    div.addEventListener("click", () => playSong(index));
    songList.appendChild(div);
  });
}

// ------------------------
// PLAYBACK FUNCTIONS
function playSong(index) {
  currentSongIndex = index;
  isPlaying = true;
  updatePlayerUI();
}

function togglePlay() {
  isPlaying = !isPlaying;
  updatePlayerUI();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  isPlaying = true;
  updatePlayerUI();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  isPlaying = true;
  updatePlayerUI();
}

function updatePlayerUI() {
  const song = songs[currentSongIndex];
  if (!song) return;
  playBtn.textContent = isPlaying ? "Pause" : "Play";
  document.getElementById("current-song").textContent = `${song.title} - ${song.artist}`;
}

// ------------------------
// UI UPDATE
function updateUI() {
  if (!user) {
    loginForm.style.display = "block";
    signupForm.style.display = "block";
    guestBtn.style.display = "block";
    logoutBtn.style.display = "none";
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    guestBtn.style.display = "none";
    logoutBtn.style.display = "block";
  }
}

// ------------------------
// EVENT LISTENERS
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  await signIn(email, password);
});

signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  await signUp(email, password);
});

guestBtn?.addEventListener("click", () => {
  user = null;
  updateUI();
});

logoutBtn?.addEventListener("click", signOut);

playBtn?.addEventListener("click", togglePlay);
nextBtn?.addEventListener("click", nextSong);
prevBtn?.addEventListener("click", prevSong);

// ------------------------
// INITIALIZE
document.addEventListener("DOMContentLoaded", async () => {
  await loadSongs();
  updateUI();
  updatePlayerUI();
});
