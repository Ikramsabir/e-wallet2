
import walletlogo from "../assets/e-wallet-logo.avif"

export default function Header(){
    return(
        <>
        <header>
    <nav className="navbar">
      <a href="#" className="logo"><img src={walletlogo} alt="E-Wallet Logo"/></a>
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
        </>
    );
}