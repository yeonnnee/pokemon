import { ResourceForPokemon } from "./pokemons";

export interface PokemonTypesApiRes {
  count: number,
  next: null,
  previous: null,
  results: ResourceForPokemon[];
}

export interface CustomPokemonType {
  name: string,
  nameKr: string,
  url: string
}