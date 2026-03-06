import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Upload(){

 const [title,setTitle] = useState("")
 const [audio,setAudio] = useState(null)
 const [cover,setCover] = useState(null)

 async function upload(){

  let user =
   (await supabase.auth.getUser()).data.user

  let audioPath =
   Date.now()+"_"+audio.name

  let coverPath =
   Date.now()+"_"+cover.name

  await supabase.storage
   .from("songs")
   .upload(audioPath,audio)

  await supabase.storage
   .from("covers")
   .upload(coverPath,cover)

  let audioUrl =
   supabase.storage
   .from("songs")
   .getPublicUrl(audioPath)
   .data.publicUrl

  let coverUrl =
   supabase.storage
   .from("covers")
   .getPublicUrl(coverPath)
   .data.publicUrl

  await supabase.from("songs").insert({
   title:title,
   artist_id:user.id,
   audio_url:audioUrl,
   cover_url:coverUrl
  })

 }

 return(

  <div style={{padding:40}}>

   <h2>Upload Song</h2>

   <input
    placeholder="Song Title"
    onChange={e=>setTitle(e.target.value)}
   />

   <input
    type="file"
    accept="audio/*"
    onChange={e=>setAudio(e.target.files[0])}
   />

   <input
    type="file"
    accept="image/*"
    onChange={e=>setCover(e.target.files[0])}
   />

   <button onClick={upload}>
    Upload
   </button>

  </div>

 )

}
