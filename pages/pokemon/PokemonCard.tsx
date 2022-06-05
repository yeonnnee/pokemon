import Image from "next/image";

import cardStyle from '../../styles/pokemon-card.module.scss'
import Link from "next/link";
import { Pokemon } from "../types/pokemons";


const PokemonCard = (pokemon:Pokemon, key: number) => {
  const pokemonIdx = getThreeDigitsIdx(pokemon.order);
  const types = pokemon.types.map(type => type.type.name);

  function getThreeDigitsIdx(pokemonOrder: number) {
    if(pokemonOrder < 10) {
      return `00${pokemonOrder}`;
    } else if(pokemonOrder > 9) {
      return `0${pokemonOrder}`;
    } else {
      return pokemonOrder.toString();
    }
  }
  
  function getClassName(index: number) {
    return cardStyle[`${types[index]}`];
  }

  console.log('card',pokemon)
  return(
    <Link href={`/pokemon/${pokemon.name}`}>
      <li className={cardStyle.card}>
        <span className={`${cardStyle.info} ${getClassName(0)}`}>No.{pokemonIdx}</span>
        <div className={cardStyle.info}>{pokemon.nameKr}</div>
        <Image width={150} height={150} src={pokemon.images.other["official-artwork"].front_default || ''} alt={pokemon.name}/>
      </li>
    </Link>
  )
}

export default PokemonCard;