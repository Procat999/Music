// js/auth.js
import { supabase } from "./supabase.js";

export let user = null;

// Google Login
export async function loginGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) console.error(error.message);
}

// Logout
export async function logout() {
  await supabase.auth.signOut();
  user = null;
  renderUI(); // refresh UI
}

// Check for guest
export function guestCheck(action) {
  if (!user) {
    alert("You must log in to " + action + "!");
    return false;
  }
  return true;
}

// Listen to auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  user = session?.user ?? null;
  renderUI();
});
