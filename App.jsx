import { useState } from "react"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Upload from "./pages/Upload"
import Login from "./components/Login"
import Player from "./components/Player"

export default function App(){

 const [page,setPage] = useState("home")
 const [currentSong,setCurrentSong] = useState(null)

 function goHome(){ setPage("home") }
 function goProfile(){ setPage("profile") }
 function goUpload(){ setPage("upload") }
 function goLogin(){ setPage("login") }

 let body = null

 if(page==="home") body = <Home playSong={setCurrentSong}/>
 if(page==="profile") body = <Profile/>
 if(page==="upload") body = <Upload/>
 if(page==="login") body = <Login/>

 return (

  <div style={{background:"#0f0f12",color:"white",minHeight:"100vh"}}>

   <div style={{display:"flex",gap:20,padding:20}}>

    <button onClick={goHome}>Home</button>
    <button onClick={goUpload}>Upload</button>
    <button onClick={goProfile}>Profile</button>
    <button onClick={goLogin}>Login</button>

   </div>

   {body}

   <Player song={currentSong}/>

  </div>

 )
}
