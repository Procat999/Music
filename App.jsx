import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Play, Pause, Heart, SkipForward, SkipBack, Shuffle, Repeat
} from "lucide-react";

// --- Supabase client ---
const supabaseUrl = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const supabaseKey = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f"; // anon key
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Mock data ---
const SONGS = [
  { id: 101, title: "Ashes to Empire", artist: "The Embers", duration: "4:03", durationSec: 243 },
  { id: 102, title: "Violet Skies", artist: "Synthwave Dreams", duration: "3:20", durationSec: 200 },
  { id: 103, title: "Golden Hour", artist: "Lunar Beats", duration: "3:23", durationSec: 203 },
];

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null); // null = guest
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());

  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    // Check session on load
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Playback Controls ---
  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentSongIndex((i) => (i + 1) % SONGS.length);
  const handlePrev = () => setCurrentSongIndex((i) => (i - 1 + SONGS.length) % SONGS.length);

  // --- Like songs (only for logged-in users) ---
  const toggleLike = (id) => {
    if (!user) return alert("Please log in to like songs!");
    const newLiked = new Set(likedSongs);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedSongs(newLiked);
  };

  // --- Login ---
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white font-sans p-6">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Phoenix Music</h1>
        {user ? (
          <button onClick={signOut} className="px-4 py-2 bg-purple-600 rounded">Logout</button>
        ) : (
          <button onClick={signInWithGoogle} className="px-4 py-2 bg-purple-600 rounded">Login with Google</button>
        )}
      </div>

      {/* --- Song List --- */}
      <div className="flex-1 overflow-y-auto">
        {SONGS.map((song, i) => (
          <div key={song.id} className="flex justify-between items-center p-3 mb-2 bg-[#111] rounded cursor-pointer"
               onClick={() => setCurrentSongIndex(i)}>
            <div>
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            <div className="flex items-center gap-4">
              <span>{song.duration}</span>
              <Heart
                size={20}
                className={`cursor-pointer ${likedSongs.has(song.id) ? "text-red-500" : "text-gray-500"}`}
                onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* --- Player Controls --- */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <SkipBack size={28} onClick={handlePrev} className="cursor-pointer hover:text-purple-400"/>
        <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
          {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
        </button>
        <SkipForward size={28} onClick={handleNext} className="cursor-pointer hover:text-purple-400"/>
      </div>

      {/* --- Guest info --- */}
      {!user && (
        <p className="mt-4 text-center text-gray-400">
          You are in guest mode. Log in to like songs, follow artists, or create playlists.
        </p>
      )}
    </div>
  );
}
