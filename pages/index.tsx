import type { GetStaticProps } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import mainStyle from '../styles/main.module.scss'
import { PokemonName, PokemonSpeciesApiRes } from '../types/speices';
import { PokemonDetailApiRes, PokemonSprites, PokemonType } from '../types/detail';
import { Pokemon, PokemonsApiRes, ResourceForPokemon } from '../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { PokemonTypesApiRes, TypeDetailApiRes } from '../types/pokemonTypes';
import PokemonFilter from '../components/PokemonFilter';
import { GenerationInfoApiRes } from '../types/generation';
import useFilterCategory from '../hooks/useFilterCategory';
import { useRouter } from 'next/router';
import { placeholder, title } from '../translate/text';

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
  types: PokemonName[][]
}


const Main = (props: MainProps) => {
  const Router = useRouter();
  const [lang, setLang] = useState('ko');
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
  const [types, setTypes] = useState<PokemonName[]>([]);
  const titleTxt = title.filter(text => text.language === lang)[0];
  const placeHolderText = placeholder.filter(placeholder => placeholder.language === lang)[0];
  const filterCategory = useFilterCategory(types); 
  const target = useRef<HTMLDivElement>(null);

  const getPokemonForm = useCallback((pokemonName: string) => {
    let label;
    const rapid = pokemonName.includes('rapid-strike'); // 연격의 태세
    const single = pokemonName.includes('single-strike'); // 일격의 태세
    const large = pokemonName.includes('large');
    const average = pokemonName.includes('average');
    const superSize = pokemonName.includes('super');
    const small = pokemonName.includes('small');
    const percentage = pokemonName.includes('50') || pokemonName.includes('10');
    const complete = pokemonName.includes('complete');

    if (rapid) label = lang === 'ko' ? '(연격의 태세)' : '(いちげきのかた)';
    if (single) label = lang === 'ko' ? '(일격의 태세)' : '(れんげきのかた)';
    if (large) label = '(L)';
    if (small) label = '(S)';
    if (average) label = '(Average)';
    if (superSize) label = '(Super)';
    if (percentage) label = lang === 'ko' ? `(${pokemonName.split('-')[1]}%폼)` : '';
    if (complete) label = lang === 'ko' ? `(퍼펙트폼)` : '';

    return label;
  }, [lang]);

  // 거다이맥스, 메가 포켓몬인 경우 표기해주기
  const getFullName = useCallback((pokemonName: string, translatedNm: string) => {
    const pokemonForm = pokemonName.split('-');
    const isGmax = pokemonName.includes('gmax');
    const isMega = pokemonName.includes('mega');
    const form = getPokemonForm(pokemonName);

    if (isGmax) return `거다이맥스 ${translatedNm} ${form || ''}`;
    if (isMega) {
      if (pokemonForm.length > 2) {
        const megaKeywordIdx = pokemonForm.indexOf('mega');
        return `메가${translatedNm}-${pokemonForm[megaKeywordIdx + 1].toUpperCase()}`;
      } else {
        return `메가${translatedNm}`;
      }
    }

    return form ? `${translatedNm} ${form}` : translatedNm;
  }, [getPokemonForm]);


  async function getDetailData(url:string) {
    const data = await fetch(url).then(result => result.json());
    return data;
  }

  async function getSpeciesData(url:string) {
    const data = await fetch(url).then(data => data.json());
    return data;
  }

  function getPokemonObj(name:string, translatedNm:string | null, images:PokemonSprites, types:PokemonType[], id: number, color: string) {
    return {
      name: name,
      translatedNm: translatedNm,
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
      const translatedNm: PokemonName = species.names.filter((d: PokemonName) => d.language.name === lang)[0];
      const fullName = lang !== 'en' ? getFullName(detail.name, translatedNm?.name) : null;
      const result = getPokemonObj(detail.name, fullName, detail.sprites, detail.types, detail.id, species.color.name);
      return result;
    }));
    setLoading(false);

    return pokemons;
  }, [getFullName, lang]);
  
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
    if (itemCount === 0) return;
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

  //TODO:  필터조회
  async function searchWithFilters(types: (string|null)[], generations: (string|null)[], enableGmax: boolean, enableMega: boolean, isAll: boolean) {    

    setPokemons([]);
    setLoading(false);
  }


  //TODO: 검색
  async function searchPokemon() {
    setPokemons([]);
    setLoading(true);
    setLoading(true);

  }

  async function searchByPokemonName(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' || !search.searchString) return;
    searchPokemon();
  }


  // DATA FETCH
  useEffect(() => {
    const query = Router.query.lang as string;
    const supportedLang = ['ko', 'en', 'ja'];
    
    if (!query || !supportedLang.includes(query)) Router.push({ pathname: '/', query: { lang: 'ko' } })
    
    setLang(query);
    const filteredTypesByLang = props.types.map(typeInfo => typeInfo.filter(t => t.language.name === query)[0]);
    fetchData(props.data.results);
    setTotal({ totalCount: props.data.count, originData: props.total.results, data: []});
    setTypes(filteredTypesByLang);

  },[Router, fetchData, props]);


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
          <input type="text" value={search.searchString} placeholder={placeHolderText?.text || ''} onChange={(e) => setSearch({ ...search, searchString: e.target.value })} onKeyUp={searchByPokemonName} />
          {search.searchString ? <FontAwesomeIcon icon={faTimes} className={mainStyle['reset-icon']} onClick={ resetSearchCondition }/> : null }
        </div>
      </div>

      {
        !loading ? 
          <div className={mainStyle['filter-container']}>
            {search.isAll ?
              <div className={mainStyle.count}>
                <p>{titleTxt?.text}</p>
                <span>{total.totalCount}</span>
              </div>
              :
              <div className={mainStyle.count}>
                <p>{titleTxt?.text}</p>
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
            return op.isChecked ? <span key={index} className={mainStyle["filter-label"]}>{op.name} </span> : null;
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

  const filteredTypeByLang = await Promise.all(types.results.map(async (type) => {
    const typeRes = await fetch(type.url).then(res => res.json());
    const typesWithLang = await typeRes.names.filter((name: any) => name.language.name == 'ko' || name.language.name == 'ja-Hrkt' || name.language.name == 'en');
    const trimJaLangData = typesWithLang.map((t:PokemonName) => {
      if (t.language.name === 'ja-Hrkt') {
        return {
          ...t,
          language: {
            ...t.language,
            name: 'ja'
          }
        }
      } else {
        return t;
      }
    })
    return trimJaLangData;
  }));

  return {
    props: { total:total, data: res, types: filteredTypeByLang }
  }
}

export default Main;