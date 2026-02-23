import React from 'react'
import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home'
import TeamsPage from './pages/Teams'
import SearchPage from './pages/Search'
import PokemonDetails from './pages/PokemonDetails'

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams/*" element={<TeamsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
