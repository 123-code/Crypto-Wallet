import React from 'react';
import { Routes, Route,BrowserRouter as Router } from "react-router-dom"
import Home from "./Pages/Home"
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Registro from "./Pages/Registro";
import Portal from "./Pages/Portal";
import MiBilletera from "./Pages/MiBilletera";
import Navbar from "./Components/Navbar";
//
function App() {
  return (
    <PayPalScriptProvider options={{"client-id":process.env.REACT_APP_CLIENT_ID}}>

    
    <div className="App">
       
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/registro" element={ <Registro/> } />
        <Route path="/portal" element={ <Portal/> } />
        <Route path="billetera" element={ <MiBilletera/> } />
        <Route path="/login" element={ <MiBilletera/> } />
      </Routes>
      
    </div>
    </PayPalScriptProvider>
  )
} 

export default App