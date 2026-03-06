// js/app.js
import { fetchSongs, toggleLike } from "./songs.js";
import { fetchPlaylists, createPlaylist } from "./playlists.js";
import { user, loginGoogle, logout } from "./auth.js";

const songListDiv = document.getElementById("song-list");
const playlistDiv = document.getElementById("playlists");

export async function renderUI() {
  document.getElementById("login-btn").style.display = user ? "none" : "inline-block";
  document.getElementById("logout-btn").style.display = user ? "inline-block" : "none";

  // Songs
  const songs = await fetchSongs();
  songListDiv.innerHTML = "";
  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song flex justify-between p-3 rounded cursor-pointer hover:bg-[#2A1B40] transition-colors";
    div.innerHTML = `
      <div>${song.title} - ${song.artist_name}</div>
      <div>
        <span class="likeBtn cursor-pointer">❤️</span>
        <span>${song.duration}</span>
      </div>
    `;
    div.querySelector(".likeBtn").onclick = e => { e.stopPropagation(); toggleLike(song.id); renderUI(); };
    songListDiv.appendChild(div);
  });

  // Playlists
  const playlists = await fetchPlaylists();
  playlistDiv.innerHTML = "";
  playlists.forEach(pl => {
    const div = document.createElement("div");
    div.className = "playlist p-2 bg-[#1D0F35] rounded mb-2 cursor-pointer hover:bg-[#A855F7]/20";
    div.textContent = pl.name;
    playlistDiv.appendChild(div);
  });
}

// Add playlist button
document.getElementById("add-playlist-btn").onclick = () => {
  const name = prompt("Enter playlist name:");
  if (name) createPlaylist(name).then(renderUI);
};

// Login/logout
document.getElementById("login-btn").onclick = loginGoogle;
document.getElementById("logout-btn").onclick = logout;

// Initial render
renderUI();
