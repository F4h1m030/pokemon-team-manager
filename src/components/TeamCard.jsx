import React from 'react'
import '../index.css'

export default function TeamCard({ team, onDelete, onOpen }) {
  return (
    <div className="card">
      <style>{`
        .team-row{display:flex;justify-content:space-between;align-items:center}
        .team-actions{display:flex;gap:8px}
      `}</style>
      <div className="team-row">
        <div>
          <strong>{team.name}</strong>
          <div className="small">{team.pokemons?.length || 0} Pokémon</div>
        </div>
        <div className="team-actions">
          <button className="button" onClick={() => onOpen(team)}>Open</button>
          <button className="button" onClick={() => onDelete(team)} style={{ marginLeft: 8 }}>Verwijder</button>
        </div>
      </div>
    </div>
  )
}
