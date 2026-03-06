// Initialize Supabase correctly using the global variable from CDN
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";

// This creates the client using the global 'supabase' object from the CDN
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const loginBtn = document.getElementById("login-btn");
const guestBtn = document.getElementById("guest-btn");

// Email login example
loginBtn.addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  
  if (!email || !password) return alert("Email and password are required!");

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  
  if (error) alert("Login failed: " + error.message);
  else alert("Logged in as: " + data.user.email);
});

// Guest mode
guestBtn.addEventListener("click", () => {
  alert("Continuing as Guest");
});
