import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function App() {
  const [user, setUser] = useState(null)
  const [songs, setSongs] = useState([])
  const [profiles, setProfiles] = useState([])
  const [currentSong, setCurrentSong] = useState(null)

  // ---------------------------
  // Auth listener
  // ---------------------------
  useEffect(() => {
    const session = supabase.auth.getSession().then(r => setUser(r.data.session?.user || null))

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  // ---------------------------
  // Fetch songs & profiles
  // ---------------------------
  const loadData = async () => {
    const { data: s } = await supabase.from("songs").select("*")
    const { data: p } = await supabase.from("profiles").select("*")
    setSongs(s)
    setProfiles(p)
  }

  useEffect(() => { loadData() }, [])

  // ---------------------------
  // Guest restrictions
  // ---------------------------
  const requireLogin = () => {
    if (!user) alert("Please log in to like, follow, or upload.")
    return !!user
  }

  // ---------------------------
  // Actions
  // ---------------------------
  const likeSong = async (song) => {
    if (!requireLogin()) return
    await supabase.from("songs").update({ likes: song.likes + 1 }).eq("id", song.id)
    loadData()
  }

  const followProfile = async (profile) => {
    if (!requireLogin()) return
    await supabase.from("followers").insert({ follower_id: user.id, following_id: profile.id })
    loadData()
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const logout = async () => { await supabase.auth.signOut() }

  // ---------------------------
  // Upload song
  // ---------------------------
  const uploadSong = async (file, title) => {
    if (!requireLogin()) return
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    await supabase.storage.from("songs").upload(fileName, file)
    const url = supabase.storage.from("songs").getPublicUrl(fileName).data.publicUrl
    await supabase.from("songs").insert({ title, file_url: url, artist_id: user.id })
    loadData()
  }

  return (
    <div className="App">
      <header>
        <h1>PhoenixMusic</h1>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={loginWithGoogle}>Login with Google</button>
        )}
      </header>

      <section>
        <h2>Profiles</h2>
        <div>
          {profiles.map(p => (
            <div key={p.id}>
              <span>{p.username}</span>
              <button onClick={() => followProfile(p)}>Follow</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Songs</h2>
        <div>
          {songs.map(s => (
            <div key={s.id}>
              <span>{s.title} ({s.likes || 0} likes)</span>
              <button onClick={() => likeSong(s)}>Like</button>
              <button onClick={() => setCurrentSong(s)}>Play</button>
            </div>
          ))}
        </div>
      </section>

      {user && (
        <section>
          <h2>Upload Song</h2>
          <input type="text" placeholder="Song Title" id="song-title" />
          <input type="file" id="song-file" />
          <button onClick={() => {
            const title = document.getElementById("song-title").value
            const file = document.getElementById("song-file").files[0]
            uploadSong(file, title)
          }}>Upload</button>
        </section>
      )}

      {currentSong && (
        <footer>
          <h3>Now Playing: {currentSong.title}</h3>
          <audio controls autoPlay src={currentSong.file_url}></audio>
        </footer>
      )}
    </div>
  )
}
