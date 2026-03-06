// js/playlists.js
import { supabase } from "./supabase.js";
import { user, guestCheck } from "./auth.js";

export async function fetchPlaylists() {
  const { data } = await supabase.from("playlists").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function createPlaylist(name) {
  if (!guestCheck("create playlists")) return;
  if (!name) return;
  await supabase.from("playlists").insert({ user_id: user.id, name });
}
