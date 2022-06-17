import { PokemonSprites, PokemonType } from "./detail"

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

export interface Pokemon {
  name: string,
  nameKr: string,
  images: PokemonSprites,
  types: PokemonType[],
  id: number,
  color: string
}