import { useEffect,useRef } from "react"

export default function Player({song}){

 const audioRef = useRef()

 useEffect(()=>{

  if(song && audioRef.current){

   audioRef.current.src = song.audio_url
   audioRef.current.play()

  }

 },[song])

 if(!song) return null

 return(

  <div style={{
   position:"fixed",
   bottom:0,
   left:0,
   right:0,
   background:"#111",
   padding:15,
   display:"flex",
   gap:20
  }}>

   <div>{song.title}</div>

   <audio ref={audioRef} controls/>

  </div>

 )

}
