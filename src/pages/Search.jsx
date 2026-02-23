import React, { useEffect, useState } from 'react'
import '../index.css'
import { fetchPokemonByName, fetchAllPokemonNames } from '../utils/pokeapi'
import PokemonCard from '../components/PokemonCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [allNames, setAllNames] = useState([])
  const [suggestions, setSuggestions] = useState([])

  // Load all names once for client-side suggestions
  useEffect(() => {
    let mounted = true
    fetchAllPokemonNames().then(names => {
      if (mounted) setAllNames(names)
    }).catch(() => {
      // silent fail — suggestions won't work
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!query) return setSuggestions([])
    const q = query.toLowerCase()
    const matches = allNames
      .filter(n => n.startsWith(q))
      .slice(0, 10)
    setSuggestions(matches)
  }, [query, allNames])

  async function handleSearch(nameToSearch) {
    const name = typeof nameToSearch === 'string' && nameToSearch.length ? nameToSearch : query
    try {
      const p = await fetchPokemonByName(name)
      setPokemon(p)
    } catch (err) {
      alert('Pokémon niet gevonden')
      setPokemon(null)
    }
  }

  function clickSuggestion(s) {
    setQuery(s)
    setSuggestions([])
    handleSearch(s)
  }

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Zoek Pokémon</h2>
      {/* local styles for search input and suggestions */}
      <style>{`
        .search-container { max-width: 600px; margin: 0 auto 32px; background: var(--card-bg); padding: 24px; border-radius: 12px; box-shadow: 0 8px 24px var(--shadow); }
        .search-wrap{position:relative;display:block;width:100%}
        .search-input { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 16px; outline: none; transition: border 0.2s, box-shadow 0.2s; }
        .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .search-button { margin-top: 12px; width: 100%; padding: 12px; }
        .suggestions{position:absolute;left:0;right:0;margin:0;padding:.25rem 0;list-style:none;background:#fff;border:1px solid #ddd;box-shadow:0 6px 18px rgba(0,0,0,.06);max-height:260px;overflow:auto;z-index:50;top:100%;margin-top:4px;border-radius:8px}
        .suggestion-item{padding:.6rem;display:flex;gap:4px;align-items:center;cursor:pointer;transition:background 0.2s}
        .suggestion-item:hover{background:var(--card-accent)}
        .suggestion-prefix{font-weight:700;color:var(--text)}
        .suggestion-suffix{color:var(--muted)}
      `}</style>
      <div className="search-container">
        <div className="search-wrap">
          <input
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Typ naam, bijv. 'char'"
            onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions" role="listbox">
              {suggestions.map(s => {
                const prefix = query
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
        <button className="button search-button" onClick={() => handleSearch()}>Zoeken</button>
      </div>

      {pokemon && (
        <div style={styles.resultContainer}>
          <h3 style={styles.resultTitle}>Zoekresultaat</h3>
          <div style={styles.resultCard}>
            <PokemonCard pokemon={pokemon} />
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  pageContainer: {
    padding: '24px',
    minHeight: 'calc(100vh - 200px)',
  },
  pageTitle: {
    fontSize: '32px',
    marginBottom: '24px',
    textAlign: 'center',
    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  resultContainer: {
    marginTop: '32px',
  },
  resultTitle: {
    fontSize: '24px',
    marginBottom: '16px',
    color: 'var(--text)',
  },
  resultCard: {
    maxWidth: '400px',
    margin: '0 auto',
  }
}
