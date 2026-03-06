import { useEffect,useState } from "react"
import { supabase } from "../supabaseClient"

export default function Profile(){

 const [user,setUser] = useState(null)

 useEffect(()=>{

  load()

 },[])

 async function load(){

  let {data} =
   await supabase.auth.getUser()

  setUser(data.user)

 }

 if(!user) return <div>Loading...</div>

 return(

  <div style={{padding:40}}>

   <h2>{user.email}</h2>

   <p>Your account profile</p>

  </div>

 )

}
