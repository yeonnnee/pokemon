import Image from "next/image";
import cardStyle from '../styles/pokemon-card.module.scss'
import labelStyle from '../styles/label.module.scss'
import Link from "next/link";
import { Pokemon } from "../types/pokemons";
import usePokemonIdx from "../hooks/usePokemonIdx";


const PokemonCard = (pokemon:Pokemon, key: number) => {
  const pokemonIdx = usePokemonIdx(pokemon.id);

  return(
    <Link href={`/pokemon/${pokemon.name}`}>
      <li className={cardStyle.card}>
        <span className={`${cardStyle.info} ${labelStyle[`${pokemon.color}`]}`}>{ pokemonIdx !== '-' ? `No.${pokemonIdx}` : '거다이맥스'}</span>
        <div className={cardStyle.info}>{pokemon.nameKr}</div>
        {
          pokemon.images.other["official-artwork"].front_default
            ? <Image width={150} height={150} src={pokemon.images.other["official-artwork"].front_default || pokemon.images.front_default} alt={pokemon.name} />
            : null
        }
      </li>
    </Link>
  )
}

export default PokemonCard;