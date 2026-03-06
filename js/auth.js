// auth.js
import { supabase } from "./supabase.js";

// Login with email/password
export async function loginEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error };
  return { user: data.user };
}

// Sign up new user
export async function signupEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };
  return { user: data.user };
}

// Logout
export async function logout() {
  await supabase.auth.signOut();
}

// Get current session
export function getCurrentUser() {
  return supabase.auth.getSession();
}
