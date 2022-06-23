import Image from "next/image";
import cardStyle from '../styles/pokemon-card.module.scss'
import labelStyle from '../styles/label.module.scss'
import Link from "next/link";
import { Pokemon } from "../types/pokemons";
import usePokemonIdx from "../hooks/usePokemonIdx";
import useLabel from "../hooks/useLabel";

interface PokemonCardProps {
  pokemon: Pokemon,
  lang: string
}

const PokemonCard = (props: PokemonCardProps) => {
  const { pokemon, lang } = props;
  const pokemonIdx = usePokemonIdx(pokemon.id);
  const label = useLabel(pokemon.name, lang, pokemonIdx);
  const translatedNm = lang !== 'en' ? pokemon.translatedNm?.filter(name => name.language === lang)[0].name : pokemon.name;

  return (
    <>
      {
        pokemon.images.other["official-artwork"].front_default ? 
          <Link href={`/pokemon/${pokemon.name}?lang=${lang}`}>
            <li className={cardStyle.card}>
              <span className={`${cardStyle.info} ${labelStyle[`${pokemon.color}`]}`}>{ label }</span>
              <div className={cardStyle.info}>{ translatedNm }</div>
                <Image width={150} height={150} src={pokemon.images.other["official-artwork"].front_default} alt={pokemon.name} />
            </li>
          </Link>
          : null
      }
    </>
  )
}

export default PokemonCard;