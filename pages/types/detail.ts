import { ResourceForPokemon } from "./pokemons"
import { FlavorTextEntry, Genera, PokemonName } from "./speices"


export interface PokemonDetail {
  name: string,
  names: PokemonName[],
  order: string,
  height: number,
  weight: number,
  types: PokemonType[],
  images: PokemonSprites,
  happiness: number,
  capture_rate: number,
  growth_rate: ResourceForPokemon,
  flavor_text_entries: FlavorTextEntry[],
  genera: Genera[],
  generation: ResourceForPokemon,
  has_gender_differences: boolean,
  is_legendary: boolean,
}
export interface PokemonDetailApiRes {
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
  }[]
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
    ['official-artwork']: FrontImage
  },
  versions: PokemonGeneration
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

export interface PokemonGeneration {
  ['generation-i']: FirstGen,
  ['generation-ii']: SecondGen,
  ['generation-iii']: ThirdGen,
  ['generation-iv']: FourthGen,
  ['generation-v']: FifthGen,
  ['generation-vi']: SixthGen,
  ['genration-vii']: {
    icons: GenerationIcons,
    ['ultra-sun-ultra-moon']: {
      front_default: string,
      front_female: string | null,
      front_shiny: string,
      front_shiny_female: string
    }
  },
  ['generation-viii']: {
    icons: GenerationIcons
  },
}

export interface FirstGen {
  ['red-blue']: {
    back_default: string,
    back_gray: string,
    back_transparent: string,
    front_default: string,
    front_gray: string,
    front_transparent: string
  }
  yellow: {
    back_default: string,
    back_gray: string,
    back_transparent: string,
    front_default: string,
    front_gray: string,
    front_transparent: string
  }
}

export interface SecondGen {
  crystal: {
    back_default: string,
    back_shiny: string,
    back_shiny_transparent: string,
    back_transparent: string,
    front_default: string,
    front_shiny: string,
    front_shiny_transparent: string,
    front_transparent: string,
  },
  gold: {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
    front_transparent: string
  },
  silver: {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
    front_transparent: string
  }
}

export interface ThirdGen {
  emerald: {
    front_default: string,
    front_shiny: string
  },
  ['firered-leafgreen']: {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
  },
  ['ruby-sapphire']: {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
  }
}

export interface FourthGen {
  ['diamond-pearl']: {
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null
  },
  ['heartgold-soulsilver']: {
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null
  },
  ['platinum']: {
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null
  }
}

export interface FifthGen {
  ['black-white']: {
    animated: {
      back_default: string,
      back_female: string | null,
      back_shiny: string,
      back_shiny_female: string | null,
      front_default: string,
      front_female: string | null,
      front_shiny: string,
      front_shiny_female: string | null
    },
    back_default: string,
    back_female: string | null,
    back_shiny: string,
    back_shiny_female: string | null,
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string | null
  }
}

export interface SixthGen {
  ['omegaruby-alphasapphire']: {
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string
  },
  ['x-y']: {
    front_default: string,
    front_female: string | null,
    front_shiny: string,
    front_shiny_female: string 
  }
}
export interface GenerationIcons {
  front_detail: string,
  front_female: string
}