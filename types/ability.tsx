import { ResourceForPokemon } from "./pokemons"

export interface AbilityApiRes {
  effect_changes: any[],
  effect_entries: AbilityEffectEntry[],
  flavor_text_entries: AbilityText[],
  generation: ResourceForPokemon,
  id: number,
  is_main_series: boolean,
  name: string,
  names: AbilityName[]
}


export interface AbilityEffectEntry {
  effect: string,
  language: ResourceForPokemon,
  short_effect: string
}

export interface AbilityText {
  flavor_text: string,
  language: ResourceForPokemon,
  version_group: ResourceForPokemon,
}

export interface AbilityName {
  language: ResourceForPokemon,
  name: string
}

export interface AbilityDetail{
  text: AbilityText[],
  name: AbilityName
}