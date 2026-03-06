export default function SongCard({song,playSong}){

 return(

  <div style={{
   background:"#1a1a1f",
   padding:15,
   borderRadius:10
  }}>

   <img
    src={song.cover_url}
    style={{width:"100%",borderRadius:6}}
   />

   <div style={{marginTop:10}}>

    <div>{song.title}</div>
    <div style={{fontSize:12,opacity:0.6}}>
     {song.plays} plays
    </div>

   </div>

   <button
    style={{marginTop:10}}
    onClick={()=>playSong(song)}
   >
    Play
   </button>

  </div>

 )

}
