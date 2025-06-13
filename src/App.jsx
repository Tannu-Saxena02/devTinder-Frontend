import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Navbar from './Navbar'
import Body from './Body'
import Login from './Login'
import Profile from './profile'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter basename='/'>
    <Routes>
      <Route path="/" element={<Body/>}>
      <Route path="/login" element={<Login/>}/>
      <Route path="/profile" element={<Profile/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
