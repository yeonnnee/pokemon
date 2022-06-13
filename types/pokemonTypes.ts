import { ResourceForPokemon } from "./pokemons";
import { PokemonName } from "./speices";

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

export interface TypeDetailApiRes {
  damage_relations: Damage,
  game_indices: Game[],
  generation: ResourceForPokemon,
  id: number,
  move_damage_class: ResourceForPokemon,
  moves: ResourceForPokemon[],
  name: string,
  names: PokemonName[],
  past_damage_relations: {
    damage_relations: Damage,
    generation: ResourceForPokemon,
  },
  pokemon: {pokemon: ResourceForPokemon, slot: number} []
}

export interface Damage {
  double_damage_from: ResourceForPokemon[],
  double_damage_to: ResourceForPokemon[],
  half_damage_from: ResourceForPokemon[],
  half_damage_to: ResourceForPokemon[],
  no_damage_from: ResourceForPokemon[],
  no_damage_to: ResourceForPokemon[],
}

export interface Game {
  game_index: number,
  generation: ResourceForPokemon
}