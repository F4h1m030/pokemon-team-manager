import React from 'react'
import '../index.css'
import { Link } from 'react-router-dom'

// Header navigatie bovenin. Gebruik de CSS-class `header` zodat styling centraal staat in index.css
export default function Header() {
  return (
    <header className="header">
      {/* Component-local styles so header looks correct even without global CSS import */}
      <style>{`
        .header{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid rgba(15,23,42,0.04);box-shadow:0 6px 18px rgba(16,24,40,.06);background:linear-gradient(180deg,rgba(255,255,255,.9),#fff);border-radius:0 0 12px 12px}
        .brand h1{font-size:20px;margin:0}
        .nav{display:flex;gap:12px}
      `}</style>
      <div className="brand">
        <h1>Pokémon Team Manager</h1>
      </div>
      <nav className="nav" aria-label="Hoofd navigatie">
        <Link to="/" className="button">Home</Link>
        <Link to="/teams" className="button">Teams</Link>
        <Link to="/search" className="button">Zoek</Link>
      </nav>
    </header>
  )
}
