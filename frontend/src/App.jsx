import { useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import bookImage from './assets/tvkFlag.jpg'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  

  return (
    <>
      <Router>
        <header className="header" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <div className="logo-container">
          <Link to="/">
            <img src={bookImage} alt="Logo" className="logo" />
          </Link>
          <Link to="/" className="nav-link">XYZ</Link>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/createUser" className="nav-link">Create User</Link>
            <Link to="/deleteUser" className="nav-link">Delete User</Link>
            <Link to="/updateUser" className="nav-link">Update User</Link>
            <Link to="/User" className="nav-link">User</Link>
          </nav>
        </header>
      </Router>
    </>
  )
}

export default App
