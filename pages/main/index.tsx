import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react';
import PokemonCard from './PokemonCard';
import { Pokemons, ResourceForPokemon } from './types';

const Main: NextPage = (props) => {
  const data = props as Pokemons;
  const [pokemons, setPokemons] = useState<Pokemons>(data);

  console.log(pokemons);
  return (
    <div>

      <div>
        <ul>
          {
            pokemons.results.map((pokemon, index) => {return <PokemonCard {...pokemon} key={index} />})
          }
        </ul>
      </div>
    </div>
  )
}

// 데이터가 있어야 화면을 그릴 수 있으므로 SSG 방식으로 렌더링
export const getStaticProps: GetStaticProps = async(context) => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  const pokemons = await res.json();
  return {
    props: { ...pokemons }
  }
}

export default Main;