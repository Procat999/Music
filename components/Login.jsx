import { supabase } from "../supabaseClient"
import { useState } from "react"

export default function Login(){

 const [email,setEmail] = useState("")
 const [password,setPassword] = useState("")

 async function signup(){

  await supabase.auth.signUp({
   email:email,
   password:password
  })

 }

 async function login(){

  await supabase.auth.signInWithPassword({
   email:email,
   password:password
  })

 }

 async function google(){

  await supabase.auth.signInWithOAuth({
   provider:"google"
  })

 }

 return(

  <div style={{padding:40}}>

   <h2>Login</h2>

   <input
    placeholder="email"
    onChange={e=>setEmail(e.target.value)}
   />

   <input
    type="password"
    placeholder="password"
    onChange={e=>setPassword(e.target.value)}
   />

   <div style={{marginTop:10}}>

    <button onClick={login}>Login</button>
    <button onClick={signup}>Sign Up</button>
    <button onClick={google}>Google</button>

   </div>

  </div>

 )

}
