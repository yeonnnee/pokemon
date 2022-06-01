import type { GetStaticProps, NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import { PokemonDetail, Pokemons, ResourceForPokemon } from './types';

const Main = (props:Pokemons) => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);

  const getDetailData = useCallback(async() => {
    const pokemons = await Promise.all( props.results.map(async (data:ResourceForPokemon) => {
      const detail = await fetch(data.url);
      const result = await detail.json();
      return result;
    }));
    setPokemons(pokemons);
  },[props]);

  console.log('pokemons', pokemons)

  useEffect(()=>{
    getDetailData();
  },[getDetailData]);
  return (
    <div>

      <div>
        <ul>
          {
            pokemons.map((pokemon, index) => {return <PokemonCard {...pokemon} key={index} />})
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