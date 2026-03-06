const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co"
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f"

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const loginBtn = document.getElementById("login")
const signupBtn = document.getElementById("signup")
const guestBtn = document.getElementById("guest")
const logoutBtn = document.getElementById("logout")
const status = document.getElementById("status")

async function checkUser(){

const { data } = await client.auth.getSession()

if(data.session){
status.innerText = "Logged in as " + data.session.user.email
}else{
status.innerText = "Not logged in"
}

}

checkUser()

loginBtn.onclick = async function(){

const email = prompt("Email")
const password = prompt("Password")

if(!email || !password)return

const { error } = await client.auth.signInWithPassword({
email:email,
password:password
})

if(error){
alert(error.message)
}else{
status.innerText = "Logged in!"
}

}

signupBtn.onclick = async function(){

const email = prompt("Email")
const password = prompt("Password")

if(!email || !password)return

const { error } = await client.auth.signUp({
email:email,
password:password
})

if(error){
alert(error.message)
}else{
alert("Account created. Check email if verification is enabled.")
}

}

guestBtn.onclick = function(){

status.innerText = "Guest mode. Some features disabled."

}

logoutBtn.onclick = async function(){

await client.auth.signOut()
status.innerText = "Logged out"

}
