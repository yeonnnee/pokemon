export interface PokemonsApiRes {
  count: number,
  next: string | null,
  previous: string | null,
  results: ResourceForPokemon[],
}

export interface ResourceForPokemon {
  name: string,
  url: string
}