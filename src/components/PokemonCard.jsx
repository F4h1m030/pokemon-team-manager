import React from 'react'
import '../index.css'
import { Link } from 'react-router-dom'

// Kleine kaart voor het tonen van een Pokémon-object
// Props:
// - pokemon: het object zoals teruggegeven door de PokeAPI
// - onAddToTeam: optionele callback om deze Pokémon toe te voegen aan een team
// - onAddFavorite: optionele callback om deze Pokémon als favoriet te markeren
export default function PokemonCard({ pokemon, onAddToTeam, onAddFavorite }) {
  if (!pokemon) return null
  const sprite = pokemon.sprites?.front_default || 'https://via.placeholder.com/96?text=No+Image'
  const types = pokemon.types?.map(t => t.type.name).join(', ')

  return (
    <div className="card pokemon-card">
      {/* Local styles for the card so it renders without external CSS */}
      <style>{`
        .pokemon-card-inner{display:flex;gap:12px;align-items:center}
        .pokemon-card-body{flex:1}
        .pokemon-card-title{font-size:18px;margin-bottom:6px}
        .pokemon-card-actions{margin-top:10px;display:flex;gap:8px}
        .pokemon-sprite{width:96px;height:96px;border-radius:12px;padding:6px;background:linear-gradient(180deg,rgba(255,255,255,.6),rgba(0,0,0,.02))}
        .type-list{display:flex;gap:6px;margin-top:6px}
        .type-badge{padding:6px 10px;border-radius:999px;font-size:12px;text-transform:capitalize;color:#fff;font-weight:600}
      `}</style>
      <div className="pokemon-card-inner">
        {/* Klikbare sprite die naar de details-pagina navigeert */}
        <Link to={`/pokemon/${pokemon.name}`} aria-label={`Bekijk details van ${pokemon.name}`}>
          <img className="pokemon-sprite" src={sprite} alt={pokemon.name} />
        </Link>

        <div className="pokemon-card-body">
          {/* Naam is ook klikbaar */}
          <div className="pokemon-card-title">
            <Link to={`/pokemon/${pokemon.name}`} className="no-decor">
              <strong style={{ textTransform: 'capitalize' }}>{pokemon.name}</strong>
            </Link>
          </div>
          <div className="small">Types:</div>
          <div className="type-list">
            {pokemon.types?.map(t => (
              <span key={t.type.name} className={`type-badge ${t.type.name}`}>{t.type.name}</span>
            ))}
          </div>

          <div className="pokemon-card-actions">
            {onAddFavorite && <button className="button" onClick={() => onAddFavorite(pokemon)}>Favoriet</button>}
            {onAddToTeam && <button className="button" onClick={() => onAddToTeam(pokemon)}>Voeg toe</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
