
const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co"
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f"

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)



const songsDiv = document.getElementById("songs")
const playBtn = document.getElementById("play")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")
const volume = document.getElementById("volume")
const songName = document.getElementById("songName")

const guestBtn = document.getElementById("guestBtn")
const loginBtn = document.getElementById("loginBtn")
const googleBtn = document.getElementById("googleBtn")


let audio = new Audio()
let songs = []
let index = 0



guestBtn.onclick = () =>
{
loadSongs()
}



loginBtn.onclick = async () =>
{

let email = prompt("email")
let password = prompt("password")

let {data,error} = await db.auth.signInWithPassword({
email:email,
password:password
})

if(error)
{
let {data:signup} = await db.auth.signUp({
email:email,
password:password
})

alert("account created")
}
else
{
alert("logged in")
}

loadSongs()

}



googleBtn.onclick = async () =>
{
await db.auth.signInWithOAuth({
provider:"google",
options:{redirectTo:location.href}
})
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

songs.forEach((s,i)=>
{

let d = document.createElement("div")
d.className = "song"

d.innerText = s.title

d.onclick = () =>
{
playSong(i)
}

songsDiv.appendChild(d)

})

}



function playSong(i)
{

index = i

audio.src = songs[i].url
audio.play()

songName.innerText = songs[i].title

}



playBtn.onclick = () =>
{

if(audio.paused)
{
audio.play()
}
else
{
audio.pause()
}

}



prevBtn.onclick = () =>
{

if(index>0)
{
playSong(index-1)
}

}



nextBtn.onclick = () =>
{

if(index < songs.length-1)
{
playSong(index+1)
}

}



volume.oninput = () =>
{
audio.volume = volume.value
}
