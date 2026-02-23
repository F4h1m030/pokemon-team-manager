import React, { useEffect, useState } from 'react'
import '../index.css'
import TeamCard from '../components/TeamCard'
import PokemonCard from '../components/PokemonCard'
import useLocalStorage from '../hooks/useLocalStorage'
import { fetchPokemonByName, fetchAllPokemonNames } from '../utils/pokeapi'
import { useNavigate } from 'react-router-dom'

export default function TeamsPage() {
  const [teams, setTeams] = useLocalStorage('teams', [])
  const [favorites, setFavorites] = useLocalStorage('favorites', [])
  const [teamName, setTeamName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [allNames, setAllNames] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  // --- Teams ---
  function addTeam() {
    if (!teamName) return
    setTeams([...teams, { id: Date.now(), name: teamName, pokemons: [] }])
    setTeamName('')
  }

  function deleteTeam(team) {
    setTeams(teams.filter(t => t.id !== team.id))
    if (selectedTeam?.id === team.id) setSelectedTeam(null)
  }

  function openTeam(team) {
    setSelectedTeam(team)
  }

  function addToTeam(pokemon) {
    if (!selectedTeam) return alert('Open eerst een team!')
    const updatedTeams = teams.map(t =>
      t.id === selectedTeam.id
        ? { ...t, pokemons: [...t.pokemons, { id: pokemon.id, name: pokemon.name, sprite: pokemon.sprites.front_default }] }
        : t
    )
    setTeams(updatedTeams)
    setSelectedTeam(prev => ({ ...prev, pokemons: [...prev.pokemons, { id: pokemon.id, name: pokemon.name, sprite: pokemon.sprites.front_default }] }))
  }

  function removeFromTeam(pokemon) {
    if (!selectedTeam) return
    const updatedPokemons = selectedTeam.pokemons.filter(p => p.id !== pokemon.id)
    const updatedTeams = teams.map(t =>
      t.id === selectedTeam.id ? { ...t, pokemons: updatedPokemons } : t
    )
    setTeams(updatedTeams)
    setSelectedTeam(prev => ({ ...prev, pokemons: updatedPokemons }))
  }

  // --- Favorieten ---
  function addFavorite(pokemon) {
    if (favorites.find(f => f.id === pokemon.id)) return
    setFavorites([...favorites, { id: pokemon.id, name: pokemon.name, sprite: pokemon.sprites.front_default }])
  }

  function removeFavorite(pokemon) {
    setFavorites(favorites.filter(f => f.id !== pokemon.id))
  }

  function addFavoriteToTeam(pokemon) {
    addToTeam(pokemon)
  }

  // --- Pokémon zoeken ---
  // Haal een Pokémon op (by name of id)
  async function handleSearch(nameToSearch) {
    const name = typeof nameToSearch === 'string' && nameToSearch.length ? nameToSearch : search
    if (!name) return
    try {
      const p = await fetchPokemonByName(name)
      setSearchResult(p)
    } catch {
      alert('Pokémon niet gevonden')
      setSearchResult(null)
    }
  }

  // Laad alle Pokémon-namen één keer om client-side suggesties te maken
  useEffect(() => {
    let mounted = true
    fetchAllPokemonNames().then(names => {
      if (mounted) setAllNames(names)
    }).catch(() => {
      // als dit faalt werken de suggesties niet, maar de rest wel
    })
    return () => { mounted = false }
  }, [])

  // Update suggesties wanneer de zoekterm of naam-lijst verandert
  useEffect(() => {
    if (!search) return setSuggestions([])
    const q = search.toLowerCase()
    const matches = allNames.filter(n => n.startsWith(q)).slice(0, 8)
    setSuggestions(matches)
  }, [search, allNames])

  function clickSuggestion(s) {
    // gebruiker klikt op suggestie -> vul input en voer zoekopdracht uit
    setSearch(s)
    setSuggestions([])
    handleSearch(s)
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .teams-header { margin-bottom: 32px; }
        .teams-header h2 { font-size: 32px; background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0; }
        .team-input-group { display: flex; gap: 12px; margin-bottom: 24px; }
        .team-input { flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid #d1d5db; outline: none; transition: border 0.2s, box-shadow 0.2s; }
        .team-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .favorites-section { margin-bottom: 32px; }
        .favorites-section h3 { font-size: 20px; margin-bottom: 16px; color: var(--primary); padding-bottom: 8px; border-bottom: 2px solid rgba(37,99,235,0.1); }
        .selected-team-section { margin-bottom: 32px; }
        .selected-team-section h3 { font-size: 20px; margin-bottom: 16px; color: var(--primary); padding-bottom: 8px; border-bottom: 2px solid rgba(37,99,235,0.1); }
        .section-title { font-size: 20px; margin: 24px 0 16px 0; color: var(--primary); padding-bottom: 8px; border-bottom: 2px solid rgba(37,99,235,0.1); }
      `}</style>
      <div className="teams-header">
        <h2>Mijn Teams</h2>
      </div>
    <div className="container two-col">
      {/* --- LINKS: Teams --- */}
      <div className="col col-left">
        <div style={styles.teamFormSection}>
          <h3 className="section-title" style={{ marginTop: 0 }}>Nieuw Team</h3>
          <div className="team-input-group">
            <input
              className="team-input"
              placeholder="Teamnaam"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTeam() }}
            />
            <button className="button" onClick={addTeam}>Maak</button>
          </div>
        </div>
        <h3 className="section-title">Teams</h3>
        <div className="grid cols-1">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} onDelete={deleteTeam} onOpen={openTeam} />
          ))}
        </div>

        {/* --- Favorieten --- */}
        <div className="favorites-section">
          <h3 className="section-title">Favorieten</h3>
          {favorites.length === 0 && <p style={{ color: 'var(--muted)' }}>Nog geen favorieten.</p>}
          <div className="favorites-grid">
                {favorites.map(f => (
                  <div key={f.id} className="card">
                    <div className="flex" style={{ justifyContent: 'space-between' }}>
                      <div className="flex">
                        <img className="pokemon-sprite" src={f.sprite} alt={f.name} />
                        <span style={{ textTransform: 'capitalize' }}>{f.name}</span>
                      </div>
                      <div className="flex">
                        <button className="button" onClick={() => navigate(`/pokemon/${f.name}`)}>Details</button>
                        <button className="button" onClick={() => removeFavorite(f)}>Verwijder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        </div>
  </div>

  {/* --- RECHTS: Geselecteerd team + Pokémon --- */}
  <div className="col col-right">
        {selectedTeam ? (
          <div>
            <h2 style={styles.teamTitle}>{selectedTeam.name}</h2>

            {/* Zoek Pokémon */}
            <div style={styles.searchSection}>
              <h3 className="section-title">Zoek Pokémon</h3>
              {/* Zoekveld met suggesties */}
              <div style={{ position: 'relative', display: 'block', width: '100%', marginBottom: '12px' }}>
                <input
                  className="team-input"
                  placeholder="Typ naam, bijv. 'char'"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions" role="listbox">
                    {suggestions.map(s => {
                      const prefix = search
                      const suffix = s.slice(prefix.length)
                      return (
                        <li key={s} className="suggestion-item" onClick={() => clickSuggestion(s)}>
                          <span className="suggestion-prefix">{prefix}</span>
                          <span className="suggestion-suffix">{suffix}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <button className="button" style={{ width: '100%', marginTop: '12px' }} onClick={() => handleSearch()}>Zoeken</button>
            </div>

            {searchResult && (
              <PokemonCard pokemon={searchResult} onAddToTeam={addToTeam} onAddFavorite={addFavorite} />
            )}

            {/* Pokémon in het team */}
            <div className="selected-team-section">
              <h3 className="section-title">Leden van dit team</h3>
              <div className="team-members-grid">
                {selectedTeam.pokemons.map(p => (
                  <div key={p.id} className="card">
                    <div className="flex" style={{ justifyContent: 'space-between' }}>
                      <div className="flex">
                        <img className="pokemon-sprite" src={p.sprite} alt={p.name} />
                        <span style={{ textTransform: 'capitalize' }}>{p.name}</span>
                      </div>
                      <button className="button" onClick={() => removeFromTeam(p)}>Verwijder</button>
                    </div>
                  </div>
                ))}
                {selectedTeam.pokemons.length === 0 && <p style={{ color: 'var(--muted)' }}>Nog geen Pokémon toegevoegd.</p>}
              </div>
            </div>
          </div>
        ) : (
          <p style={styles.emptyMessage}>Selecteer een team om Pokémon toe te voegen</p>
        )}
      </div>
    </div>
    </div>
  )
}

const styles = {
  pageContainer: {
    padding: '24px',
  },
  teamFormSection: {
    background: 'var(--card-bg)',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    marginBottom: '24px',
  },
  teamTitle: {
    fontSize: '28px',
    margin: '0 0 24px 0',
    color: 'var(--primary)',
  },
  searchSection: {
    marginBottom: '24px',
    background: 'var(--card-bg)',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
  },
  emptyMessage: {
    color: 'var(--muted)',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px 20px',
  }
}
