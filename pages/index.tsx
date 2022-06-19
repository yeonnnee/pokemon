import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import mainStyle from '../styles/main.module.scss'
import { PokemonName, PokemonSpeciesApiRes } from '../types/speices';
import { PokemonDetailApiRes, PokemonSprites, PokemonType } from '../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomPokemonType, PokemonTypesApiRes, TypeDetailApiRes } from '../types/pokemonTypes';
import PokemonFilter from '../components/PokemonFilter';
import { GenerationInfoApiRes } from '../types/generation';
import useFilterCategory from '../hooks/useFilterCategory';
import { useRouter } from 'next/router';

interface TotalState {
  totalCount: number,
  data: Pokemon[]
  originData: ResourceForPokemon[]
}

export interface SearchState {
  searchString: string,
  types: (string | null)[],
  generations: (string | null)[],
  enableGmax: boolean,
  enableMega: boolean,
  isAll: boolean
}

interface MainProps {
  data: PokemonsApiRes,
  total: PokemonsApiRes,
  types: CustomPokemonType[]
}


const Main = (props: MainProps) => {
  const Router = useRouter();
  const [lang, setLang] = useState('kr');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState<TotalState>({ totalCount: 0, data: [], originData: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<SearchState>({
    searchString: '',
    types: [],
    generations: [],
    enableGmax: false,
    enableMega: false,
    isAll: true
  });
  const [itemCount, setItemCount] = useState<number>(0);
  const [types, setTypes] = useState<CustomPokemonType[]>([]);
 
  const filterCategory = useFilterCategory(types); 
  const target = useRef<HTMLDivElement>(null);


  function getPokemonForm(pokemonName: string) {
    let label;
    const rapid = pokemonName.includes('rapid-strike'); // 연격의 태세
    const single = pokemonName.includes('single-strike'); // 일격의 태세
    const large = pokemonName.includes('large');
    const average = pokemonName.includes('average');
    const superSize = pokemonName.includes('super');
    const small = pokemonName.includes('small');
    const percentage = pokemonName.includes('50') || pokemonName.includes('10');
    const complete = pokemonName.includes('complete');

    if (rapid) label = '(연격의 태세)';
    if (single) label = '(일격의 태세)';
    if (large) label = '(L)';
    if (small) label = '(S)';
    if (average) label = '(Average)';
    if (superSize) label = '(Super)';
    if (percentage) label = `(${pokemonName.split('-')[1]}%폼)`;
    if (complete) label = `(퍼펙트폼)`;

    return label;
  }

  // 거다이맥스, 메가 포켓몬인 경우 표기해주기
  const getFullName = useCallback((pokemonName: string, nameKr: string) => {
    const pokemonForm = pokemonName.split('-');
    const isGmax = pokemonName.includes('gmax');
    const isMega = pokemonName.includes('mega');
    const form = getPokemonForm(pokemonName);

    if (isGmax) return `거다이맥스 ${nameKr} ${form || ''}`;
    if (isMega) {
      if (pokemonForm.length > 2) {
        const megaKeywordIdx = pokemonForm.indexOf('mega');
        return `메가${nameKr}-${pokemonForm[megaKeywordIdx + 1].toUpperCase()}`;
      } else {
        return `메가${nameKr}`;
      }
    }

    return form ? `${nameKr} ${form}` : nameKr;
  }, []);


  async function getDetailData(url:string) {
    const data = await fetch(url).then(result => result.json());
    return data;
  }

  async function getSpeciesData(url:string) {
    const data = await fetch(url).then(data => data.json());
    return data;
  }

  function getPokemonObj(name:string, nameKr:string, images:PokemonSprites, types:PokemonType[], id: number, color: string) {
    return {
      name: name,
      nameKr: nameKr,
      images: images,
      types: types,
      id: id,
      color: color
    }
  }

  // 데이터 받아서 customizing
  const getPokemons = useCallback(async (data: ResourceForPokemon[]) => {
    setLoading(true);

    const pokemons = await Promise.all(data.map(async (pokemon) => {
      const detail: PokemonDetailApiRes = await getDetailData(pokemon.url);
      const species:PokemonSpeciesApiRes = await getSpeciesData(detail.species.url);
      const nameKr: PokemonName = species.names.filter((d: PokemonName) => d.language.name === 'ko')[0];
      const fullName = getFullName(detail.name, nameKr.name);
      const result = getPokemonObj(detail.name, fullName, detail.sprites, detail.types, detail.id, species.color.name);
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
  const getMorePokemons = useCallback(async (count: number) => {
    if (search.searchString || !search.isAll) return;
    const res: PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=0`).then(res => res.json());
    await fetchData(res.results);
    
  }, [fetchData, search]);

  // 무한 스크롤 : 스크롤 하단 위치시 데이터 추가 로드
  const checkIntersect = useCallback(async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (!entry.isIntersecting) return;
    await getMorePokemons(itemCount + 50);
  }, [getMorePokemons, itemCount]);



  // 검색조건 초기화 (전체조회)
  async function resetSearchCondition() {
    if (search.searchString || !search.isAll) {
      setPokemons([]);
      setLoading(true);
      setSearch({
        ...search,
        searchString: '',
      });
      await searchPokemon();
    }
    setLoading(false);
  }


  async function filterByTypes(types: (string | null)[]) {
    const pokemon = await Promise.all(types.map(async (type) => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data: TypeDetailApiRes = await res.json();
      const result = data.pokemon.map(pokemon => { return { ...pokemon.pokemon } });

      return result;
    }));

    const filteredArr = pokemon.reduce(function (acc, cur) {
      return acc.concat(cur);
    });

    return filteredArr;
  }

  async function filterByGeneration(generations: (string | null)[]) {    
    const pokemon = await Promise.all(generations.map(async (gen) => {
      const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
      const data: GenerationInfoApiRes = await res.json();
      return data.pokemon_species;
    }));


    const filteredArr = pokemon.reduce(function (acc, cur) {
      return acc.concat(cur);
    });

    return filteredArr;
  }


  function compareData(filteredByGen:ResourceForPokemon[], filteredByTypes:ResourceForPokemon[]) {
    let standardArr: ResourceForPokemon[] = [];
    let targetArr: ResourceForPokemon[] = [];

    if (filteredByGen.length >= filteredByTypes.length) {
      standardArr = filteredByGen;
      targetArr = filteredByTypes;
    } else {
      standardArr = filteredByTypes;
      targetArr = filteredByGen;
    }

    const filterResult = standardArr.filter(standardArrItem => {
      let flag = false;

      targetArr.forEach(targetArrItem => {
        if (targetArrItem.name === standardArrItem.name) {
          flag = true;
        }
      });
      return flag;
    });

    return filterResult;
  }

  // 필터조회
  async function searchWithFilters(types: (string|null)[], generations: (string|null)[], enableGmax: boolean, enableMega: boolean, isAll: boolean) {    
    setSearch((prev) => { return { ...prev, types, generations, enableGmax, enableMega, isAll: isAll } });

    if (isAll) {
      return searchPokemon();
    }

    setLoading(true);
    setPokemons([]);

    let filteredByTypes: ResourceForPokemon[] = [];
    let filteredByGen: ResourceForPokemon[] = [];

    // 타입 필터
    if (types.length > 0) {
      filteredByTypes = await filterByTypes(types);
    }

    // 세대 필터
    if (generations.length > 0) {
      const filteredByGenPokemons = await filterByGeneration(generations);
  
      filteredByGen = filteredByGenPokemons.map((gen) => {
        return total.originData.filter(d => d.name === gen.name)[0];
      }).filter(el => el !== undefined);
    }

    // 필터 결과
    let filteredResult: Pokemon[] = [];
    
    if (filteredByTypes.length > 0 && filteredByGen.length > 0) {
      const filterDupilicatedData = compareData(filteredByGen, filteredByTypes);
      filteredResult = await getPokemons(filterDupilicatedData);
    } else if (types.length > 0 && generations.length == 0) {
      filteredResult =  await getPokemons(filteredByTypes);
    } else if (generations.length > 0 && types.length == 0) {
      filteredResult = await getPokemons(filteredByGen);
    }
  


    if (search.searchString) {
      filteredResult = filteredResult.filter(result => result.nameKr.includes(search.searchString));
    } 

    setPokemons(filteredResult);
    setLoading(false);
  }


  // 검색
  async function searchPokemon() {
    setPokemons([]);
    setLoading(true);
    setLoading(true);

    const pokemons = total.data.length > 0 ? total.data : await getPokemons(total.originData);

    if (search.isAll) {
      const result = pokemons.filter(pokemon => pokemon.nameKr.includes(search.searchString));
      setPokemons(result);
      setLoading(false);
      return;
    } else {
      searchWithFilters(search.types, search.generations, search.enableGmax, search.enableMega, false);
    }
  }
  async function searchByPokemonName(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' || !search.searchString) return;
    searchPokemon();
  }

  // 거다이맥스 필터
  async function getGmaxPokemons() {
    setSearch({ ...search, enableGmax: true, enableMega: false, isAll: false });  
    setLoading(true);
    setPokemons([]);
    
    const gmaxPokemons = total.originData.filter(pokemon => pokemon.name.includes('gmax'));
    const gmaxPokemonsData = await getPokemons(gmaxPokemons);
  
    return gmaxPokemonsData;
  }

  // 메가포켓몬 필터
  async function getMegaPokemons() {
    setSearch({ ...search, enableMega: true, enableGmax:false, isAll: false });
    setLoading(true);
    setPokemons([]);
  
    const megaPokemons = total.originData.filter(pokemon => pokemon.name.includes('mega'));
    const megaPokemonsData = await getPokemons(megaPokemons);

    return megaPokemonsData;
  }

  function changeLang() {
    Router.push({pathname:'/', query:{lang:"En"}});
  }

  // DATA FETCH
  useEffect(() => {
    const lang = Router.query.lang;

    console.log(Router.query);
    console.log(pokemons);

    setTotal({ totalCount: props.data.count, originData: props.total.results, data: []});
    setTypes(props.types);

  },[Router,pokemons, props]);

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
      
      <button onClick={changeLang}>English</button>

      {
        !loading ? 
          <div className={mainStyle['filter-container']}>
            {search.isAll ?
              <div className={mainStyle.count}>
                <p>포켓몬</p>
                <span>{total.totalCount}</span>
              </div>
              :
              <div className={mainStyle.count}>
                <p>포켓몬</p>
                <span>{pokemons.length}</span>
              </div>
            }

            <PokemonFilter
              filterCategory={filterCategory}
              searchWithFilters={searchWithFilters}
            />
          </div>
        : null
      }

      {
        !loading ? 
        <ul className={mainStyle["filter-condition-list"]}>
          {filterCategory.map(category => category.options.map((op, index) => {
            return op.isChecked ? <span key={index} className={mainStyle["filter-label"]}>{op.nameKr}</span> : null;
          }))}
        </ul>
        : null
      }


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