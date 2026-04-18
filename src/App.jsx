import Header from './components/header'
import Footer from './components/footer'
import Indexscreen from './components/Index'
import Logins from './components/Login'
import Dashboard from './components/Dashboard'
import { useState } from 'react'

import './App.css'

function App() {
  const [login,setLogin]=useState(false);
  const [dashboard,setdashboard]=useState(false);

  return (
    <>
   
   <Header/>
  {dashboard? <Dashboard setLogin={setLogin}/>:(login?<Logins setdashboard={setdashboard}/> : <Indexscreen setLogin={setLogin}/>)}

   <Footer/>

    </>
  )
}

export default App
