
import Illustrationphoto from "../assets/e-Wallet6.gif"
export default function Logins(){
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
            <input  type="email" placeholder="Adresse e-mail" required />
          </div>
          <div className="input-group">
            <input  type="password" placeholder="Mot de passe" required />
            <span className="toggle-password" >👁</span>
          </div>
          <p></p>
          <button  type="button" className=" btn btn-primary">
            Se connecter
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