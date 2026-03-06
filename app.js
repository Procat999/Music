// app.js
// Initialize Supabase
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const guestBtn = document.getElementById("guest-btn");
const logoutBtn = document.getElementById("logout-btn");

const usernameEl = document.getElementById("username");
const pfpEl = document.getElementById("pfp");
const profileDiv = document.getElementById("profile");

const songsListEl = document.getElementById("songs-list");
const playlistsListEl = document.getElementById("playlists-list");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume");
const currentSongEl = document.getElementById("current-song");

let currentUser = null;
let guestMode = false;
let songs = [];
let playlists = [];
let currentSongIndex = 0;
const audio = new Audio();

// --- Auth Handlers ---
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  currentUser = data.user;
  guestMode = false;
  renderUser();
  fetchData();
}

async function signup(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });
  if (error) return alert(error.message);
  currentUser = data.user;
  guestMode = false;
  renderUser();
  fetchData();
}

function continueAsGuest() {
  currentUser = null;
  guestMode = true;
  renderUser();
  fetchData();
}

async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  guestMode = true;
  renderUser();
  fetchData();
}

// --- Render User Info ---
function renderUser() {
  if (guestMode || !currentUser) {
    profileDiv.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    guestBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  } else {
    profileDiv.classList.remove("hidden");
    usernameEl.textContent = currentUser.user_metadata.username || currentUser.email;
    pfpEl.src = currentUser.user_metadata.pfp || "https://via.placeholder.com/50";
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    guestBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  }
}

// --- Fetch Songs and Playlists ---
async function fetchData() {
  // Songs
  const { data: songsData, error: songError } = await supabase.from("songs").select("*");
  if (songError) return console.error(songError);
  songs = songsData || [];
  renderSongs();

  // Playlists
  const { data: playlistsData, error: playlistError } = await supabase.from("playlists").select("*");
  if (playlistError) return console.error(playlistError);
  playlists = playlistsData || [];
  renderPlaylists();
}

// --- Render Functions ---
function renderSongs() {
  songsListEl.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.classList.add("song-item");
    div.innerHTML = `
      <span>${song.title} - ${song.artist}</span>
      <button>${guestMode ? "Login to Like" : "Like (${song.likes || 0})"}</button>
    `;
    div.addEventListener("click", () => playSong(index));
    const btn = div.querySelector("button");
    if (!guestMode) {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await likeSong(song.id);
        fetchData();
      });
    } else {
      btn.addEventListener("click", () => alert("Login to like songs"));
    }
    songsListEl.appendChild(div);
  });
}

function renderPlaylists() {
  playlistsListEl.innerHTML = "";
  playlists.forEach(pl => {
    const div = document.createElement("div");
    div.classList.add("playlist-item");
    div.textContent = pl.name;
    playlistsListEl.appendChild(div);
  });
}

// --- Song Functions ---
function playSong(index) {
  if (!songs[index]) return;
  currentSongIndex = index;
  audio.src = songs[index].url;
  audio.play();
  currentSongEl.textContent = `${songs[index].title} - ${songs[index].artist}`;
}

function playNext() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
}

function playPrev() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
}

async function likeSong(songId) {
  if (!currentUser) return;
  const { error } = await supabase.from("songs").update({ likes: supabase.rpc("increment", { val: 1 }) }).eq("id", songId);
  if (error) console.error(error);
}

// --- Player Controls ---
playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

// --- Button Listeners ---
loginBtn.addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  login(email, password);
});

signupBtn.addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  const username = prompt("Username:");
  signup(email, password, username);
});

guestBtn.addEventListener("click", continueAsGuest);
logoutBtn.addEventListener("click", logout);

// --- Initial Load ---
guestMode = true;
renderUser();
fetchData();
