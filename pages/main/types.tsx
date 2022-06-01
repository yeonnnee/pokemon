export interface Pokemons {
  count: number,
  next: string | null,
  previous: string | null,
  results: ResourceForPokemon[],
}

export interface ResourceForPokemon {
  name: string,
  url: string
}

export interface PokemonDetail {
  abilities: PokemonAbility[],
  base_experience: number,
  forms: ResourceForPokemon[],
  game_indices: PokemonGame[],
  height: number,
  weight: number,
  held_items: PokemonItem[],
  id: number,
  is_default: boolean,
  location_area_encounters: string,
  moves: PokemonMove[],
  name: string,
  order: number,
  past_types: any[],
  species: ResourceForPokemon,
  sprites: PokemonSprites,
  stats: PokemonStat[],
  types: PokemonType[]
}

export interface PokemonAbility {
  ability: {
    name: string,
    url: string,
    is_hidden: boolean,
    slot: number
  }
}

export interface PokemonGame {
  game_index: number,
  version: ResourceForPokemon
}

export interface PokemonItem {
  item: ResourceForPokemon,
  version_details: {
    rarity: number,
    version: ResourceForPokemon
  }
}

export interface PokemonMove {
  move: ResourceForPokemon,
  version_group_details: {
    level_learn_method: ResourceForPokemon,
    version_group: ResourceForPokemon,
  }
}

export interface PokemonSprites extends FrontImage, BackImage {
  other: {
    dream_world: FrontImage,
    home: FrontImage,
    official_artwork: FrontImage
  },
  versions: any
}

export interface FrontImage {
  front_default?: string,
  front_gray?: string,
  front_transparent?: string,
  front_female?: null | string,
  front_shiny?: null | string,
  front_shiny_female?: null | string,
}

export interface BackImage {
  back_default?: string,
  back_gray?: string,
  back_transparent: string,
  back_female?: null | string,
  back_shiny?: null | string,
  back_shiny_female?: null | string,
}

export interface PokemonStat {
  base_stat: number,
  url: string,
  stat: ResourceForPokemon
}

export interface PokemonType {
  slot: number,
  type: ResourceForPokemon // normal, fire, grass, water...
}