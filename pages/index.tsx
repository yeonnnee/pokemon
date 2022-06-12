import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from '../components/PokemonCard';

import mainStyle from '../styles/main.module.scss'
import { PokemonName } from '../types/speices';
import { PokemonDetailApiRes } from '../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomPokemonType, PokemonTypesApiRes } from '../types/pokemonTypes';
import PokemonFilter from '../components/PokemonFilter';

interface TotalState {
  totalCount: number,
  data: Pokemon[]
  originData: ResourceForPokemon[]
}

interface SearchState {
  searchString: string,
  isSearching: boolean,
  types: string[],
  generations:string[]
}

interface MainProps {
  data: PokemonsApiRes,
  total: PokemonsApiRes,
  types: CustomPokemonType[]
}

const Main = (props:MainProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState<TotalState>({totalCount: 0, data: [], originData: []});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<SearchState>({searchString: '', isSearching: false, types:[], generations:[]});
  const [itemCount, setItemCount] = useState<number>(0);
  const [types, setTypes] = useState<CustomPokemonType[]>([]);
  const [filter, setFilter] = useState<string>('all');

  
  const target = useRef<HTMLDivElement>(null);

  // 거다이맥스, 메가 포켓몬인 경우 표기해주기
  const getFullName = useCallback((pokemonName: string, nameKr:string) => {
    const isGmax = pokemonName.includes('gmax');
    const isMega = pokemonName.includes('mega');

    if (isGmax) return `${nameKr} (거다이맥스)`;
    if (isMega) return `메가${nameKr}`;
    
    return nameKr;
  }, []);


  // 데이터 받아서 customizing
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
  
  // 데이터 fetch
  const fetchData = useCallback(async (data: ResourceForPokemon[]) => {
    const pokemons = await getPokemons(data);
    setPokemons(pokemons);
    setItemCount(pokemons.length);
  }, [getPokemons]);


  // 50개 추가 데이터 로드
  const getMorePokemons = useCallback(async (count:number) => {
    if (search.isSearching) return;
    const res: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=0`).then(res => res.json());
    await fetchData(res.results);
    
  }, [fetchData, search]);

  // 무한 스크롤 : 스크롤 하단 위치시 데이터 추가 로드
  const checkIntersect = useCallback(async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (!entry.isIntersecting) return;
    await getMorePokemons(itemCount + 50);
  }, [getMorePokemons,itemCount]);



  // 검색조건 초기화 (전체조회)
  async function resetSearchCondition() {
    if (search.isSearching) {
      setPokemons([]);
      setLoading(true);
      setSearch({ searchString: '', isSearching: false, generations:[], types:[] });
      await getMorePokemons(50);
    } else {
      setSearch({ ...search, searchString:'', generations:[], types:[] });
    }
    setFilter('all');
  }

  // 검색
  async function searchByPokemonName(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' || !search.searchString) return;

    setPokemons([]);
    setLoading(true);
    setSearch({ ...search, isSearching: true });

    const pokemons = total.data.length > 0 ? total.data : await getPokemons(total.originData);

    switch (filter) {
      case 'all': {
        const result = pokemons.filter(pokemon => pokemon.nameKr.includes(search.searchString));
        setPokemons(result);
        setLoading(false);
        return;
      };
      case 'gmaxPokemon': return getGmaxPokemons();
      case 'megaPokemon': return getMegaPokemons();
      default: {
        setPokemons([]);
        setLoading(false);
        return;
      }
    }
  }

  // 거다이맥스 필터
  async function getGmaxPokemons() {
    setSearch({ ...search, isSearching: true });
    const pokemons = total.data.length > 0 ? total.data : await getPokemons(total.originData);
    
    let gmaxPokemon = pokemons.filter(data => data.nameKr.includes('거다이맥스'));
    if (search.searchString) {
      gmaxPokemon = gmaxPokemon.filter(data => data.nameKr.includes(search.searchString));
    }
    setPokemons(gmaxPokemon);
    setFilter('gmaxPokemon');
    setLoading(false);

  }

  // 메가포켓몬 필터
  async function getMegaPokemons() {
    setSearch({ ...search, isSearching: true });
    const pokemons = total.data.length > 0 ? total.data : await getPokemons(total.originData);

    let megaPokemon = pokemons.filter(data => data.nameKr.includes('메가'));
    if (search.searchString) {
      megaPokemon = megaPokemon.filter(data => data.nameKr.includes(search.searchString));
    }
    setPokemons(megaPokemon);
    setFilter('megaPokemon');
    setLoading(false);

  }

  // DATA FETCH
  useEffect(() => {
    fetchData(props.data.results);
    setTotal({ totalCount: props.data.count, originData: props.total.results, data: []});
    setTypes(props.types);

  },[fetchData, props]);

  // Intersection Observer API
  useEffect(() => {
    const observer = new IntersectionObserver(checkIntersect, {threshold:1});
    if (target.current) observer.observe(target.current);
    return () => observer && observer.disconnect();
  }, [checkIntersect]);

  return (
    <div className={mainStyle.main}>
 
      <div className={mainStyle['search-section']}>
        <div className={mainStyle['search-bar']}>
          <FontAwesomeIcon icon={ faSearch } className={mainStyle['search-icon']}/>
          <input type="text" value={search.searchString} placeholder='포켓몬 이름을 입력해주세요' onChange={(e) => setSearch({ ...search, searchString: e.target.value })} onKeyUp={searchByPokemonName} />
          {search.searchString ? <FontAwesomeIcon icon={faTimes} className={mainStyle['reset-icon']} onClick={ resetSearchCondition }/> : null }
        </div>
      </div>

      <PokemonFilter
        resetSearchCondition={resetSearchCondition}
        types={types}
        setFilter={setFilter}
        filter={filter}
        getGmaxPokemons={getGmaxPokemons}
        getMegaPokemons={getMegaPokemons}
      />

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
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50&offset=0").then(res => res.json());
  const total: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${res.count}&offset=0`).then(res => res.json());
  const types: PokemonTypesApiRes = await fetch("https://pokeapi.co/api/v2/type").then(res => res.json());
  const customTypes = types.results.map(type => {
    return {
      ...type,
      nameKr: convertTypeName(type.name)
    }
  });
 
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
      case 'unknown': return '?';
      case 'shadow': return '다크 ';
      default: return '';
    }
  }

  return {
    props: { total:total, data: res, types: customTypes }
  }
}

export default Main;