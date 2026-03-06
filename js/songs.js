// js/songs.js
import { supabase } from "./supabase.js";
import { user, guestCheck } from "./auth.js";

export async function fetchSongs() {
  const { data } = await supabase.from("songs").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function toggleLike(songId) {
  if (!guestCheck("like songs")) return;
  const { data: existing } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("song_id", songId);

  if (existing.length) {
    await supabase.from("likes").delete().eq("user_id", user.id).eq("song_id", songId);
  } else {
    await supabase.from("likes").insert({ user_id: user.id, song_id: songId });
  }
}
