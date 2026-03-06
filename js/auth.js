// auth.js
import { supabase } from './supabase.js';

// Login
export async function loginEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error };
}

// Signup
export async function signupEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user, error };
}

// Logout
export async function logout() {
  await supabase.auth.signOut();
}

// Get session
export function getCurrentUser() {
  return supabase.auth.getSession();
}
