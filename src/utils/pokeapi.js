export async function fetchPokemonByName(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
  if (!res.ok) throw new Error('Pokémon niet gevonden')
  return res.json()
}

let _allPokemonNamesCache = null

export async function fetchAllPokemonNames() {
  if (_allPokemonNamesCache) return _allPokemonNamesCache
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200000')
  if (!res.ok) throw new Error('Kon Pokémon-lijst niet ophalen')
  const data = await res.json()
  _allPokemonNamesCache = data.results.map(r => r.name)
  return _allPokemonNamesCache
}
