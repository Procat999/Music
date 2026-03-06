const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co"
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f"

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const songsDiv = document.getElementById("songs")
const playBtn = document.getElementById("play")
const volume = document.getElementById("volume")
const guestBtn = document.getElementById("guestBtn")
const loginBtn = document.getElementById("loginBtn")

let audio = new Audio()
let songs = []
let index = 0


guestBtn.onclick = () =>
{
loadSongs()
}


loginBtn.onclick = async () =>
{

let email = prompt("Email")
let password = prompt("Password")

let {data,error} = await db.auth.signInWithPassword({
email:email,
password:password
})

if(error)
{
await db.auth.signUp({
email:email,
password:password
})

alert("Account created")
}
else
{
alert("Logged in")
}

loadSongs()

}



async function loadSongs()
{

let {data,error} = await db
.from("songs")
.select("*")

if(error)
{
console.log(error)
return
}

songs = data
songsDiv.innerHTML = ""

songs.forEach((song,i)=>
{

let div = document.createElement("div")

div.innerText = song.title
div.style.cursor = "pointer"

div.onclick = () =>
{
playSong(i)
}

songsDiv.appendChild(div)

})

}



function playSong(i)
{

index = i
audio.src = songs[i].url
audio.play()

}



playBtn.onclick = () =>
{

if(audio.paused)
audio.play()
else
audio.pause()

}



volume.oninput = () =>
{
audio.volume = volume.value
}
