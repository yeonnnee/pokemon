import { ResourceForPokemon } from "./pokemons"


export interface PokemonSpeciesApiRes {
  base_happiness: number,
  capture_rate: number, 
  color: ResourceForPokemon,
  egg_groups: ResourceForPokemon[],
  evolution_chain: {
    url: string
  },
  evolves_from_species: null,
  flavor_text_entries: FlavorTextEntry[],
  form_descriptions: any[],
  forms_switchable: boolean,
  gender_rate: number,
  genera: Genera[],
  generation: ResourceForPokemon,
  growth_rate: ResourceForPokemon,
  habitat: ResourceForPokemon,
  has_gender_differences: boolean,
  hatch_counter: number,
  id: number,
  is_baby: boolean,
  is_legendary: boolean,
  is_mythical: boolean,
  name: string,
  names: PokemonName[],
  order: number,
  pal_park_encounters: PalParkEncounter[],
  pokedex_numbers: PokedexNumber[],
  shape: ResourceForPokemon,
  varieties: Varity[]
}

export interface PokemonName {
  language: ResourceForPokemon,
  name: string // 이상해씨
}

export interface PalParkEncounter {
  area: ResourceForPokemon,
  base_score: number,
  rate: number
}

export interface Varity {
  is_default: boolean,
  pokemon: ResourceForPokemon
}

export interface PokedexNumber {
  entry_number: number,
  pokedex: ResourceForPokemon
}

export interface FlavorTextEntry {
  flavor_text: string,
  language: ResourceForPokemon,
  version: ResourceForPokemon
}

export interface Genera {
  genus: string, //  씨앗포켓몬
  language: ResourceForPokemon
}

