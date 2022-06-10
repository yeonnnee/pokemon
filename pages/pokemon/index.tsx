import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from '../../components/PokemonCard';

import mainStyle from '../../styles/main.module.scss'
import Image from 'next/image';
import { PokemonName } from '../../types/speices';
import { PokemonDetailApiRes } from '../../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomPokemonType, PokemonTypesApiRes } from '../../types/pokemonTypes';


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
  const [types, setTypes] = useState<CustomPokemonType[]>([]);

  const target = useRef<HTMLDivElement>(null);

  const getFullName = useCallback((pokemonName: string, nameKr:string) => {
    const isGmax = pokemonName.includes('gmax');
    const isMega = pokemonName.includes('mega');

    if (isGmax) return `${nameKr} (거다이맥스)`;
    if (isMega) return `메가${nameKr}`;
    
    return nameKr;
  }, []);


  const getPokemons = useCallback(async (data: ResourceForPokemon[]) => {
    setLoading(true);

    const pokemons = await Promise.all( data.map(async (pokemon) => {
      const detail:PokemonDetailApiRes = await fetch(pokemon.url).then(result => result.json());
      const species = await fetch(detail.species.url).then(data => data.json());
      const nameKr: PokemonName = await species.names.filter((d: PokemonName) => d.language.name === 'ko')[0];
      const fullName = getFullName(detail.name, nameKr.name);

      const result = {
        name: detail.name,
        nameKr: fullName,
        images: detail.sprites,
        types: detail.types,
        order: detail.order
      }
      return result;
    }));
    setLoading(false);

    return pokemons;
  }, [getFullName]);
  
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

  function convertTypeName(name: string) {
    switch (name) {
      case 'normal': return '노말';
      case 'fighting': return '격투';
      case 'flying': return '비행';
      case 'poison': return '독';
      case 'ground': return '땅';
      case 'rock': return '바위';
      case 'bug': return '벌레';
      case 'ghost': return '고스트';
      case 'steel': return '강철';
      case 'fire': return '불꽃';
      case 'water': return '물';
      case 'grass': return '풀';
      case 'electric': return '전기';
      case 'psychic': return '에스퍼';
      case 'ice': return '얼음';
      case 'dragon': return '드레곤';
      case 'dark': return '악';
      case 'fairy': return '페어리';
      case 'unknown': return 'unKnown';
      case 'shadow': return '다크 ';
      default: return '';
    }
  }

  const fetchTypes = useCallback(async () => {
    const res:PokemonTypesApiRes = await fetch("https://pokeapi.co/api/v2/type").then(res => res.json());
    const result = res.results.map(result => {
      return {
        ...result,
        nameKr: convertTypeName(result.name)
      }
    });
    setTypes(result);
  }, []);

  useEffect(() => {
    fetchData(props.results);
    fetchTypes();
    setTotal({totalCount: props.count, data:[]});
  },[fetchData, props, fetchTypes]);

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

      <div className={mainStyle.filter}>
        <input className={ mainStyle["filter-btn"] } type="checkbox" id="filter" />
        <label className={mainStyle["filter-label"]} htmlFor="filter">Type</label>

        <div className={mainStyle["scroll-wrapper"]}>
          <ul className={mainStyle["type-list"]}>
              <li>
                <input type="radio" id="all"/>
                <label htmlFor="all"> 전체 </label>
              </li>
            {
              types.map((type, index) => {
                return (
                  <li key={index}>
                    <input type="radio" id={ type.name }/>
                    <label htmlFor={ type.name }> {type.nameKr} </label>
                  </li>
                )
              })
            }

          </ul>
        </div>
        
      </div>
      { 
        pokemons.length === 0 && !loading ? <p className={mainStyle["no-result"]}>검색 결과가 없습니다.</p> :
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