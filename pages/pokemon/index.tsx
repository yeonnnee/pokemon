import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';

import mainStyle from '../../styles/main.module.scss'
import Image from 'next/image';
import { PokemonName } from '../../types/speices';
import { PokemonDetailApiRes } from '../../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../../types/pokemons';

const Main = (props:PokemonsApiRes) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [moreLoading, setMoreLoading]= useState<boolean>(true);

  const getDetailData = useCallback(async() => {
    const pokemons = await Promise.all( props.results.map(async (data:ResourceForPokemon) => {
      const detail:PokemonDetailApiRes = await fetch(data.url).then(result => result.json());
      const species = await fetch(detail.species.url).then(data => data.json());
      const nameKr:PokemonName = await species.names.filter((d: PokemonName) => d.language.name === 'ko')[0];
      const result = {
        name: detail.name,
        nameKr: nameKr.name,
        images: detail.sprites,
        types: detail.types,
        order: detail.order
      }
      return result;
    }));
    setPokemons(pokemons);
  },[props]);

  useEffect(()=>{
    getDetailData();
  },[getDetailData]);

  return (
    <div className={mainStyle.main}>
      <div className={mainStyle.logo}>
        <Image src="/main_logo.png" alt="logo"  width={300} height={130} />
      </div>
      <div className={mainStyle['search-section']}>
        <input type="text" placeholder='search'/>
      </div>
      <ul className={mainStyle['pokemon-list']}>
        {
          pokemons.map((pokemon, index) => {return <PokemonCard {...pokemon} key={index} />})
        }
        { moreLoading ? <li>Loading...</li> : null}
      </ul>
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