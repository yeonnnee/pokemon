import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from './PokemonCard';

import mainStyle from '../../styles/main.module.scss'
import Image from 'next/image';
import { PokemonName } from '../../types/speices';
import { PokemonDetailApiRes } from '../../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../../types/pokemons';

const Main = (props:PokemonsApiRes) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemCount, setItemCount] = useState<number>(0);

  const target = useRef<HTMLDivElement>(null);

  const getPokemons = useCallback(async (data: ResourceForPokemon[]) => {
    setLoading(true);

    const pokemons = await Promise.all( data.map(async (pokemon) => {
      const detail:PokemonDetailApiRes = await fetch(pokemon.url).then(result => result.json());
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
    setItemCount(pokemons.length);
    setLoading(false);
  }, []);
  

  const getMorePokemons = useCallback(async () => {
    const res: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemCount * 2}&offset=0`).then(res => res.json());
    await getPokemons(res.results);
    
  }, [itemCount, getPokemons]);

  const checkIntersect = useCallback(async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (!entry.isIntersecting) return;
    await getMorePokemons();
  }, [getMorePokemons]);


  useEffect(()=>{
    getPokemons(props.results);
  },[getPokemons, props]);

  useEffect(() => {
    const observer = new IntersectionObserver(checkIntersect, {threshold:1});
    if (target.current) observer.observe(target.current);
    return () => observer && observer.disconnect();
  }, [checkIntersect]);

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

      </ul>

      <div ref={target} className={mainStyle.loading}>
        { loading ? <span>Loading</span> : null}
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