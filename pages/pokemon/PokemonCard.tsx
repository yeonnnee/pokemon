import Image from "next/image";
import cardStyle from '../../styles/pokemon-card.module.scss'
import Link from "next/link";
import { Pokemon } from "../../types/pokemons";
import usePokemonIdx from "../../hooks/usePokemonIdx";


const PokemonCard = (pokemon:Pokemon, key: number) => {
  const pokemonIdx = usePokemonIdx(pokemon.order);
  const types = pokemon.types.map(type => type.type.name);
  
  function getClassName(index: number) {
    return cardStyle[`${types[index]}`];
  }

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