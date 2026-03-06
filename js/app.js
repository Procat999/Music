// js/app.js
import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {

  const status = document.getElementById("status");
  const loginBtn = document.getElementById("login");
  const guestBtn = document.getElementById("guest");
  const logoutBtn = document.getElementById("logout");

  // Show user session if already logged in
  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      status.textContent = `Logged in as ${session.user.email}`;
      loginBtn.style.display = "none";
      guestBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      status.textContent = "Not logged in";
    }
  }

  checkSession();

  // Email login
  loginBtn.addEventListener("click", async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (!email || !password) return;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      status.textContent = "Login failed: " + error.message;
    } else {
      status.textContent = "Logged in as: " + data.user.email;
      loginBtn.style.display = "none";
      guestBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    status.textContent = "Logged out";
    loginBtn.style.display = "inline-block";
    guestBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  });

  // Guest mode
  guestBtn.addEventListener("click", () => {
    status.textContent = "Continuing as Guest. Some features disabled.";
    loginBtn.style.display = "none";
    guestBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  });

});
