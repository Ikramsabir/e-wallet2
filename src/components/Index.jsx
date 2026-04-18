
import { useState } from "react";
import walletImg from "../assets/e-Wallet6.gif";



export default function Indexscreen({setLogin}){
  const [Charger,setCharger]=useState(false);
    function login(){
      setCharger(true);
      setTimeout(()=>{
        setLogin(true);
      },2000);
         
    }
    return(
        <>
   
        <main>
    <section className="hero">
      <div className="hero-content" id="main">
        <h1>E-Wallet</h1>
        <p>Gérez vos finances facilement et en toute sécurité. Simplifiez vos paiements et transactions grâce à notre solution moderne.</p>
        <div className="buttons">
          <button className="btn btn-primary" onClick={login}>{Charger?"Charger....":"Login"}</button>
          <button className="btn btn-secondary">Sign in</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={walletImg} alt="E-Wallet Illustration" />
      </div>
    </section>
  </main>
 
      
        </>
    )
}