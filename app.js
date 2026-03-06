// Supabase CDN already loaded via <script> in index.html
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const guestBtn = document.getElementById('guestBtn');
const emailLoginBtn = document.getElementById('emailLoginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');

const profileSection = document.getElementById('profileSection');
const songsSection = document.getElementById('songsSection');
const playerSection = document.getElementById('playerSection');

const songsList = document.getElementById('songsList');
const currentSong = document.getElementById('currentSong');

const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');

let audio = new Audio();
let currentIndex = 0;
let songs = [];

// ====== AUTH ======
guestBtn.addEventListener('click', () => {
  profileSection.classList.remove('hidden');
  songsSection.classList.remove('hidden');
  playerSection.classList.remove('hidden');
  loadSongs();
});

emailLoginBtn.addEventListener('click', async () => {
  const email = prompt("Enter email:");
  const password = prompt("Enter password:");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return alert(signUpError.message);
    alert("Signed up successfully! Log in again.");
    return;
  }
  alert("Logged in as " + email);
  showUI();
});

googleLoginBtn.addEventListener('click', async () => {
  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.href } });
});

async function showUI() {
  profileSection.classList.remove('hidden');
  songsSection.classList.remove('hidden');
  playerSection.classList.remove('hidden');
  loadSongs();
}

// ====== SONGS ======
async function loadSongs() {
  const { data, error } = await supabase.from('songs').select('*');
  if (error) return console.error(error);
  songs = data;
  songsList.innerHTML = '';
  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.addEventListener('click', () => playSong(i));
    songsList.appendChild(li);
  });
}

// ====== PLAYER ======
function playSong(index) {
  if (!songs[index]) return;
  currentIndex = index;
  audio.src = songs[index].url;
  audio.play();
  currentSong.textContent = songs[index].title;
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  } else {
    audio.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }
});

prevBtn.addEventListener('click', () => playSong(currentIndex - 1));
nextBtn.addEventListener('click', () => playSong(currentIndex + 1));
volumeSlider.addEventListener('input', () => audio.volume = volumeSlider.value);

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  profileSection.classList.add('hidden');
  songsSection.classList.add('hidden');
  playerSection.classList.add('hidden');
});
