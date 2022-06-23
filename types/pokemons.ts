import { PokemonSprites, PokemonType } from "./detail"
import { PokemonName } from "./speices"

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
  translatedNm: PokemonTranslatedName[] | null,
  images: PokemonSprites,
  types: PokemonType[],
  id: number,
  color: string
}

export interface PokemonTranslatedName {
  language: string,
  name: string
}