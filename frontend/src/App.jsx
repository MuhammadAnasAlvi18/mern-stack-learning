import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Header from '../components/Header'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'
import {Loader} from "lucide-react"

function App() {

  const { checkAuth, user, isCheckAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckAuth && !user) return (
    <div className='loader'>
      <Loader />
    </div>
  );

  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ user ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={user ? <Navigate to={"/"} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={"/"} /> : <Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
