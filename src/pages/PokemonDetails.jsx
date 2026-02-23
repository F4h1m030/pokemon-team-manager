import React, { useEffect, useState } from 'react'
import '../index.css'
import { useParams } from 'react-router-dom'
import { fetchPokemonByName } from '../utils/pokeapi'
import PokemonCard from '../components/PokemonCard'

// Detailspagina voor één Pokémon. Route: /pokemon/:name
export default function PokemonDetails() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    // Haal de Pokémon op zodra de route-parameter beschikbaar is
    fetchPokemonByName(name)
      .then(p => { if (mounted) setPokemon(p) })
      .catch(() => { if (mounted) setPokemon(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [name])

  if (loading) return <div style={styles.centerContainer}><p style={styles.loadingText}>⏳ Laden...</p></div>
  if (!pokemon) return <div style={styles.centerContainer}><p style={styles.errorText}>❌ Pokémon niet gevonden.</p></div>

  return (
    <div className="pokemon-details">
      <h2 style={styles.pageTitle}>{pokemon.name} Details</h2>
      <div className="details-grid">
        <div className="details-panel">
          <PokemonCard pokemon={pokemon} />
          
          <h3>Abilities</h3>
          <ul className="abilities-list">
            {pokemon.abilities.map(a => (
              <li 
                key={a.ability.name} 
                className={`ability-item ${a.is_hidden ? 'hidden' : ''}`}
              >
                {a.ability.name}
                {a.is_hidden && <span className="small"> (hidden)</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="details-panel">
          <h3>Base Stats</h3>
          <div>
            {pokemon.stats.map(s => {
              // Calculate percentage for stat bar (max base stat is roughly 255)
              const percentage = Math.min(100, (s.base_stat / 255) * 100)
              return (
                <div key={s.stat.name} className="stat-bar">
                  <span className="stat-label">{s.stat.name}</span>
                  <span className="stat-value">{s.base_stat}</span>
                  <div className="stat-bar-bg">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <h3>Moves</h3>
          <ul className="moves-list">
            {pokemon.moves.slice(0, 12).map(m => (
              <li key={m.move.name} className="move-item">
                {m.move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '24px',
  },
  loadingText: {
    fontSize: '18px',
    color: 'var(--muted)',
  },
  errorText: {
    fontSize: '18px',
    color: 'var(--accent)',
  },
  pageTitle: {
    textTransform: 'capitalize',
    fontSize: '36px',
    marginBottom: '32px',
    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}
