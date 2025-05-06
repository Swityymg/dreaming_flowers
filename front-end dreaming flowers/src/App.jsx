import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import Boton from './components/Boton'
import Caja from './components/CajaTexto'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Contact from './pages/Contact'
import NuevaFloreria from './pages/NuevaFloreria'
import 'bootstrap/dist/js/bootstrap.min.js'
import Fotos from "./pages/Fotos";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />d
        <Route path='/contacto' element={<Contact/>} />
        <Route path='/nueva-floreria' element={<NuevaFloreria/>}/>
        <Route path='/subir-fotos' element={<Fotos/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
