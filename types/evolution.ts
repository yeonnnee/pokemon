import { ResourceForPokemon } from "./pokemons"

export interface EvolutionApiRes {
  id: number,
  baby_trigger_item: null,
  chain: {
    evolution_details: any[],
    evolves_to: EvolvesTo[],
    is_baby: false,
    species: ResourceForPokemon // 처음
  } 
}


export interface EvolvesTo {
  evolution_details: EvolutionDetail[],
  evolves_to: [
    {
      evolution_details: EvolutionDetail[],
      evolves_to: [],
      is_baby: boolean,
      species: ResourceForPokemon // 세번쨰 진화
    }
  ],
  is_baby: false,
  species: ResourceForPokemon // 두번째 진화
}

export interface EvolutionDetail {
  gender: null,
  held_item: null,
  item: null,
  known_move: null,
  known_move_type: null,
  location: null,
  min_affection: null,
  min_beauty: null,
  min_happiness: null,
  min_level: number,
  needs_overworld_rain: boolean,
  party_species: null,
  party_type: null,
  relative_physical_stats: null,
  time_of_day: string,
  trade_species: null,
  trigger: ResourceForPokemon,
  turn_upside_down: boolean
}