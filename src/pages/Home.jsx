import React from 'react'
import '../index.css'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={styles.container}>
      <style>{`
        .home-hero { text-align: center; padding: 40px 20px; }
        .home-hero h2 { font-size: 42px; margin-bottom: 16px; background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .home-hero p { font-size: 18px; color: var(--muted); margin-bottom: 32px; }
        .home-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .home-actions .button { padding: 12px 24px; font-size: 16px; }
      `}</style>
      <div className="home-hero">
        <h2>Welkom bij Pokémon Team Manager</h2>
        <p>Bouw en beheer je eigen Pokémon-teams. Zoek je favoriete Pokémon en stel teams samen.</p>
        <div className="home-actions">
          <Link to="/teams" className="button">Ga naar Teams</Link>
          <Link to="/search" className="button secondary">Zoek Pokémon</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
