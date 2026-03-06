// Plain JS Supabase
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authButtons = document.getElementById("auth-buttons");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const songsList = document.getElementById("songs-list");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");

let songs = [];
let currentIndex = 0;
let isPlaying = false;
let audio = new Audio();

// --- AUTH ---
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) showUser(data.session.user.email);
  else showGuest();
}

function showUser(email) {
  authButtons.style.display = "none";
  userInfo.style.display = "block";
  userEmail.textContent = email;
}

function showGuest() {
  authButtons.style.display = "block";
  userInfo.style.display = "none";
}

loginBtn.onclick = async () => {
  const email = prompt("Enter email:");
  const password = prompt("Enter password:");
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else showUser(data.user.email);
};

signupBtn.onclick = async () => {
  const email = prompt("Enter email:");
  const password = prompt("Enter password:");
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm!");
};

logoutBtn.onclick = async () => {
  await supabaseClient.auth.signOut();
  showGuest();
};

// --- SONGS ---
async function loadSongs() {
  const { data, error } = await supabaseClient.from("songs").select("*");
  if (error) songsList.innerHTML = "<p>Error loading songs.</p>";
  else {
    songs = data;
    renderSongs();
  }
}

function renderSongs() {
  songsList.innerHTML = "";
  songs.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `<span>${s.title} - ${s.artist}</span>`;
    div.onclick = () => playSong(i);
    songsList.appendChild(div);
  });
}

// --- PLAYER ---
function playSong(index) {
  currentIndex = index;
  audio.src = songs[index].url;
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>`;
}

playBtn.onclick = () => {
  if (!songs.length) return;
  if (isPlaying) { audio.pause(); isPlaying=false; updatePlayIcon(); }
  else { audio.play(); isPlaying=true; updatePlayIcon(); }
};

function updatePlayIcon() {
  playBtn.innerHTML = isPlaying
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>`;
}

prevBtn.onclick = () => {
  if (!songs.length) return;
  currentIndex = (currentIndex-1+songs.length)%songs.length;
  playSong(currentIndex);
};

nextBtn.onclick = () => {
  if (!songs.length) return;
  currentIndex = (currentIndex+1)%songs.length;
  playSong(currentIndex);
};

volumeSlider.oninput = () => { audio.volume = volumeSlider.value/100; };

// --- INIT ---
checkSession();
loadSongs();
