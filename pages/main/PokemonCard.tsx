import { NextPage } from "next";
import Image from "next/image";
import { PokemonDetail, ResourceForPokemon } from "./types";

interface Props {
  name: string,
  url: string
}

const PokemonCard = (pokemon:PokemonDetail, key: number) => {
  const pokemonIdx = getThreeDigitsIdx(pokemon.order);

  function getThreeDigitsIdx(pokemonOrder: number) {
    if(pokemonOrder < 10) {
      return `00${pokemonOrder}`;
    } else if(pokemonOrder > 9) {
      return `0${pokemonOrder}`;
    } else {
      return pokemonOrder.toString();
    }

  }
  
  console.log('card',pokemon)
  return(
    <li>
      <div>{pokemon.name}</div>
      <div>No.{pokemonIdx}</div>
      <div>{pokemon.types[0].type.name}</div>
      <Image width={150} height={150} src={pokemon.sprites.front_default || ''} alt={pokemon.name}/>
    </li>
  )
}

export default PokemonCard;