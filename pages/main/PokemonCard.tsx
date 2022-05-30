import { NextPage } from "next";
import { ResourceForPokemon } from "./types";

interface Props {
  name: string,
  url: string
}

const PokemonCard = ({name, url}:ResourceForPokemon) => {

  return(
    <li>{name}</li>
  )
}

export default PokemonCard;