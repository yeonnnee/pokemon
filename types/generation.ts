import { ResourceForPokemon } from "./pokemons";

export interface GenerationInfoApiRes {
  abilities: [],
  id: number,
  main_region: ResourceForPokemon,
  moves: ResourceForPokemon[],
  name: string,
  namse: ResourceForPokemon[],
  pokemon_species: ResourceForPokemon[],
  types: ResourceForPokemon[],
  version_groups: ResourceForPokemon[]
}