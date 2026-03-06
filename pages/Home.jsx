import { useEffect,useState } from "react"
import { supabase } from "../supabaseClient"
import SongCard from "../components/SongCard"

export default function Home({playSong}){

 const [songs,setSongs] = useState([])

 useEffect(()=>{

  load()

 },[])

 async function load(){

  let {data} =
  await supabase
   .from("songs")
   .select("*")
   .order("plays",{ascending:false})

  setSongs(data || [])

 }

 return(

  <div style={{padding:30}}>

   <h2>Trending</h2>

   <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>

    {songs.map(song=>

     <SongCard
      key={song.id}
      song={song}
      playSong={playSong}
     />

    )}

   </div>

  </div>

 )

}
