import Image from "next/image";
import cardStyle from '../styles/pokemon-card.module.scss'
import labelStyle from '../styles/label.module.scss'
import Link from "next/link";
import { Pokemon } from "../types/pokemons";
import usePokemonIdx from "../hooks/usePokemonIdx";
import { gmaxLabel } from "../translate/text";

interface PokemonCardProps {
  pokemon: Pokemon,
  lang: string
}

const PokemonCard = (props: PokemonCardProps) => {
  const { pokemon, lang } = props;
  const pokemonIdx = usePokemonIdx(pokemon.id);
  const gmaxText = gmaxLabel.filter(text => text.language == lang)[0].text;
  const label = pokemon.name.includes('gmax') ? `${gmaxText}` : `No.${pokemonIdx}`;

  return(
    <Link href={`/pokemon/${pokemon.name}?lang=${lang}`}>
      <li className={cardStyle.card}>
        <span className={`${cardStyle.info} ${labelStyle[`${pokemon.color}`]}`}>{ label }</span>
        <div className={cardStyle.info}>{ lang !== 'en' ? pokemon.translatedNm : pokemon.name}</div>
        {
          pokemon.images.other["official-artwork"].front_default
            ? <Image width={150} height={150} src={pokemon.images.other["official-artwork"].front_default || pokemon.images.front_default || pokemon.images.front_shiny} alt={pokemon.name} />
            : null
        }
      </li>
    </Link>
  )
}

export default PokemonCard;