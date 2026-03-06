// Supabase setup
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

// --- AUTH FUNCTIONS ---
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showUser(data.session.user.email);
  } else {
    showGuest();
  }
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
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else showUser(data.user.email);
};

signupBtn.onclick = async () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Signup successful! Check your email.");
};

logoutBtn.onclick = async () => {
  await supabaseClient.auth.signOut();
  showGuest();
};

// --- FETCH SONGS ---
async function loadSongs() {
  const { data, error } = await supabaseClient.from("songs").select("*");
  if (error) {
    songsList.innerHTML = "<p>Error loading songs.</p>";
    return;
  }
  songs = data;
  renderSongs();
}

function renderSongs() {
  songsList.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `<span>${song.title} - ${song.artist}</span>`;
    div.onclick = () => playSong(index);
    songsList.appendChild(div);
  });
}

// --- PLAYER FUNCTIONS ---
function playSong(index) {
  currentIndex = index;
  audio.src = songs[index].url; // assume your table has 'url' column
  audio.play();
  isPlaying = true;
  playBtn.textContent = "Pause";
}

playBtn.onclick = () => {
  if (!songs.length) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "Play";
  } else {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "Pause";
  }
};

prevBtn.onclick = () => {
  if (!songs.length) return;
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
};

nextBtn.onclick = () => {
  if (!songs.length) return;
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
};

volumeSlider.oninput = () => {
  audio.volume = volumeSlider.value / 100;
};

// --- INIT ---
checkSession();
loadSongs();
