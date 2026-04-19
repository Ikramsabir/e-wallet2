import Illustrationphoto from "../assets/e-Wallet6.gif"
import { useState } from "react"
import { finduserbymail } from "../data/database";



export default function Logins({setdashboard}){
  const [email,setEmail]= useState("");
  const [password,setPassword]=useState("");
  const [Search,setSearch]=useState(false);

  function handler(){
    setSearch(true);
    if(email==="" && password===""){
      alert("les Champs sont vides !");
      setSearch(false);
    }else{
      setTimeout(()=>{
        let user=finduserbymail(email,password);
        if(user){
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          setdashboard(true);
        }else{
          setSearch(false);
          alert("ne trouve pas !!!");
        }
      },2000);
    }
  }

    return(
        <>
     
        <main>
    <section className="hero">
     
      <div className="hero-content">
        <h1>Connexion</h1>
        <p>
          Accédez à votre E-Wallet en toute sécurité et gérez vos transactions en toute confiance.
        </p>
        <div > </div>
        <form className="login-form">
          <div className="input-group">
            <input  type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Adresse e-mail" required />
          </div>
          <div className="input-group">
            <input  type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Mot de passe" required />
            <span className="toggle-password" >👁</span>
          </div>
          <p></p>
          <button  type="button"  className="btn btn-primary" onClick={handler}>
           { Search?"Search .....":"Se connecter"}
          </button>
        </form>
        <p style={{margintop: "15px", fontsize:"0.9rem"}}>
          Vous n’avez pas encore de compte ?
          <a href="#" style={{color: "#3b66f6",fontweight:"600"}}>
            S’inscrire
          </a>
        </p>
      </div>
    
      <div className="hero-image">
        <img src={Illustrationphoto} alt="Illustration de connexion"/>
      </div>
    </section>
  </main>
  
        </>
    )
}