import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from './PokemonCard';

import mainStyle from '../../styles/main.module.scss'
import Image from 'next/image';
import { PokemonName } from '../../types/speices';
import { PokemonDetailApiRes } from '../../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TotalState {
  totalCount: number,
  data: ResourceForPokemon[]
}

interface SearchState {
  searchString: string,
  isSearching: boolean
}
const Main = (props:PokemonsApiRes) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState<TotalState>({totalCount: 0, data: []});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<SearchState>({searchString: '', isSearching: false});
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
    setLoading(false);

    return pokemons;
  }, []);
  
  const fetchData = useCallback(async (data: ResourceForPokemon[]) => {
    const pokemons = await getPokemons(data);
    setPokemons(pokemons);
    setItemCount(pokemons.length);

  }, [getPokemons]);


  const getMorePokemons = useCallback(async (count:number) => {
    if (search.isSearching) return;
    const res: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=0`).then(res => res.json());
    await fetchData(res.results);
    
  }, [fetchData, search]);

  const checkIntersect = useCallback(async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (!entry.isIntersecting) return;
    await getMorePokemons(itemCount + 50);
  }, [getMorePokemons,itemCount]);



  const getTotalPokemons = async () => {
    const res: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total.totalCount}&offset=0`).then(res => res.json());
    return res.results;
  }

  async function resetSeachCondition() {
    if (search.isSearching) {
      setPokemons([]);
      setLoading(true);
      setSearch({ searchString: '', isSearching: false });
      await getMorePokemons(50);
    } else {
      setSearch({ ...search, searchString:'' });
    }
  }

  async function searchByPokemonName(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' || !search.searchString) return;

    setPokemons([]);
    setLoading(true);
    setSearch({ ...search, isSearching: true });
    let totalPokemons: ResourceForPokemon[] | null = null;

    if (total.data.length === 0) {
      totalPokemons = await getTotalPokemons();
      setTotal({ ...total, data: totalPokemons });
    }

    const data = await getPokemons(totalPokemons || total.data);
    const result = data.filter(pokemon => pokemon.nameKr.includes(search.searchString));

    setPokemons(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchData(props.results);
    setTotal({totalCount: props.count, data:[]});
  },[fetchData, props]);

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
        <div className={mainStyle['search-bar']}>
          <FontAwesomeIcon icon={ faSearch } className={mainStyle['search-icon']}/>
          <input type="text" value={search.searchString} placeholder='포켓몬 이름을 입력해주세요' onChange={(e) => setSearch({ ...search, searchString: e.target.value })} onKeyUp={searchByPokemonName} />
          
          {search.searchString ? <FontAwesomeIcon icon={faTimes} className={mainStyle['reset-icon']} onClick={ resetSeachCondition }/> : null }
        </div>
      </div>

      { 
        pokemons.length === 0 && !loading ? <p>검색 결과가 없습니다.</p> :
        <ul className={mainStyle['pokemon-list']}>
          {
            pokemons.map((pokemon, index) => {return <PokemonCard {...pokemon} key={index} />})
          }
        </ul>
      }

      <div ref={target} className={mainStyle.loading}>
        { loading ? <span>Loading</span> : null}
      </div>
    </div>
  )
}

// 데이터가 있어야 화면을 그릴 수 있으므로 SSG 방식으로 렌더링
export const getStaticProps: GetStaticProps = async(context) => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50&offset=0");
  const pokemons = await res.json();

  return {
    props: { ...pokemons }
  }
}

export default Main;