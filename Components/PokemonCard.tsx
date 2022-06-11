import Image from "next/image";
import cardStyle from '../styles/pokemon-card.module.scss'
import labelStyle from '../styles/label.module.scss'
import Link from "next/link";
import { Pokemon } from "../types/pokemons";
import usePokemonIdx from "../hooks/usePokemonIdx";


const PokemonCard = (pokemon:Pokemon, key: number) => {
  const pokemonIdx = usePokemonIdx(pokemon.order);
  const types = pokemon.types.map(type => type.type.name);
  
  function getClassName(index: number) {
    return labelStyle[`${types[index]}`];
  }

  return(
    <Link href={`/pokemon/${pokemon.name}`}>
      <li className={cardStyle.card}>
        <span className={`${cardStyle.info} ${getClassName(0)}`}>{ pokemonIdx !== '-' ? `No.${pokemonIdx}` : '다이맥스'}</span>
        <div className={cardStyle.info}>{pokemon.nameKr}</div>
        {
          pokemon.images.other["official-artwork"].front_default
            ? <Image width={150} height={150} src={pokemon.images.other["official-artwork"].front_default} alt={pokemon.name} />
            : null
        }
      </li>
    </Link>
  )
}

export default PokemonCard;