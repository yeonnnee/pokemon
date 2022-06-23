import type { GetStaticProps } from 'next'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import PokemonCard from '../Components/PokemonCard';
import mainStyle from '../styles/main.module.scss'
import { PokemonName, PokemonSpeciesApiRes } from '../types/speices';
import { PokemonDetailApiRes, PokemonSprites, PokemonType } from '../types/detail';
import { Pokemon, PokemonTranslatedName} from '../types/pokemons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { PokemonTypesApiRes, TypeDetailApiRes, TypePokemon } from '../types/pokemonTypes';
import PokemonFilter from '../Components/PokemonFilter';
import useFilterCategory, { OptionItem } from '../hooks/useFilter';

import { placeholder, title } from '../translate/text';
import useInfinitScroll from 'hooks/useInfinitScroll';
import useCheckSupportedLang from 'hooks/useCheckSupportedLang';


interface TotalState {
  totalCount: number,
  data: TypePokemon[]
}
export interface SearchState {
  searchString: string,
  isSearching: boolean,
}

interface MainProps {
  data: TypePokemon[],
  types: OptionItem[][]
}


const Main = (props: MainProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState<TotalState>({ totalCount: 0, data: []});
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<SearchState>({ searchString: '', isSearching: false });
  const [itemCount, setItemCount] = useState<number>(0);

  const lang = useCheckSupportedLang();
  const titleTxt = title.filter(text => text.language === lang)[0];
  const placeHolderText = placeholder.filter(placeholder => placeholder.language === lang)[0];
  const typeFilter = useFilterCategory(props.types, lang);
  const target = useRef<HTMLDivElement>(null);

  useInfinitScroll(target, loadMorePokemon);




  const getPokemonForm = useCallback((pokemonName: string) => {
    let label:string = '';
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

  // 메가 포켓몬인 경우 표기해주기
  const getFullName = useCallback((pokemonName: string, translatedNm: string, language:string) => {
    const pokemonForm = pokemonName.split('-');
    const isMega = pokemonName.includes('mega');
    const form = getPokemonForm(pokemonName);
    const megaText = language === 'ko' ? '메가' : 'メガ';

    let name: string;
    if (isMega) {
      if (pokemonForm.length > 2) {
        const megaKeywordIdx = pokemonForm.indexOf('mega');
        name = `${megaText}${translatedNm}-${pokemonForm[megaKeywordIdx + 1].toUpperCase()}`;
      } else {
        name = `${megaText}${translatedNm}`;
      }
    }

    name = form ? `${translatedNm} ${form}` : translatedNm;

    return {
      name: name,
      language: language
    }
  }, [getPokemonForm]);


  async function getDetailData(url:string) {
    const data = await fetch(url).then(result => result.json());
    return data;
  }

  async function getSpeciesData(url:string) {
    const data = await fetch(url).then(data => data.json());
    return data;
  }

  function getPokemonObj(name:string, translatedNm:PokemonTranslatedName[] | null, images:PokemonSprites, types:PokemonType[], id: number, color: string) {
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
  const getPokemons = useCallback(async (data: TypePokemon[]) => {
    const pokemons = await Promise.all(data.map(async (pokemon) => {
      const detail: PokemonDetailApiRes = await getDetailData(pokemon.pokemon.url);
      const species:PokemonSpeciesApiRes = await getSpeciesData(detail.species.url);
      const translatedNm: PokemonName[] = species.names.filter((d: PokemonName) => d.language.name === 'ko' || d.language.name == 'ja');
      const fullName = translatedNm.map((name) => getFullName(detail.name, name?.name, name.language.name));
      const result = getPokemonObj(detail.name, fullName, detail.sprites, detail.types, detail.id, species.color.name);
      return result;
    }));
    return pokemons;
  }, [getFullName]);
  
  
  // 데이터 fetch
  const fetchData = useCallback(async (data: TypePokemon[]) => {
    setLoading(true);
    const fetchedData = await getPokemons(data);
    setPokemons(pokemons.concat(fetchedData));
    setLoading(false);
  }, [getPokemons, pokemons]);


  async function loadMorePokemon () {
    if (initialLoading) return;

    if (total.data.length === 0) {
      setTotal({ totalCount: props.data.length, data: props.data });
    }
    const nextPokemons = total.data.slice(itemCount, itemCount + 20);
    if (total.totalCount === pokemons.length) return;
    
    await fetchData(nextPokemons);
    setItemCount(itemCount + 20);    
  };



  // 검색조건 초기화
  function resetSearchCondition() {
    setSearch({
      isSearching:false,
      searchString: '',
    });

    if (itemCount === 20) return;
    const selectedOption = typeFilter?.options.filter(op => op.isChecked)[0].code;
    filterByType(selectedOption || '');
  }


  //타입별 조회
  async function filterByType(selectedType: string | null) {
    if (!selectedType) return;

    setPokemons([]);
    setInitialLoading(true);
    setLoading(true);
    setItemCount(0);

    const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
    const data: TypeDetailApiRes = await res.json();
    const result = data.pokemon.map(pokemon => { return { ...pokemon } });

    if (result.length == 0) {
      setItemCount(0);
      setPokemons([]);
      setLoading(false);

      return;
    }

    setTotal({ totalCount: data.pokemon.length, data: data.pokemon });
    const filteredPokemons = await getPokemons(result.splice(0, 20));

    setPokemons(filteredPokemons);
    setItemCount(20);
    setInitialLoading(false);
    setLoading(false);
  }

  function checkCharEn(event: ChangeEvent<HTMLInputElement>) {
    const reg = /^[a-zA-Z]*$/;
    
    if (!reg.test(event.target.value)) { 
      return;
    } else {
      setSearch({ ...search, searchString: event.target.value });
    }
  }


  async function searchByPokemonName(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' || (!search.searchString && !search.isSearching)) return;
    if (!search.searchString) return resetSearchCondition();

    setItemCount(0);
    setPokemons([]);
    setInitialLoading(true);
    setSearch({ ...search, isSearching: true });

    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.searchString}`)
      .then(res => res.json())
      .catch(error => setPokemons([]));

    if (result) {
      const species:PokemonSpeciesApiRes = await getSpeciesData(result.species.url);
      const translatedNm: PokemonName[] = species.names.filter((d: PokemonName) => d.language.name === 'ko' || d.language.name === 'ja');
      const fullName = translatedNm.map(name => getFullName(result.name, name?.name, name.language.name));
      const searchedPokemon = getPokemonObj(result.name, fullName, result.sprites, result.types, result.id, species.color.name);
      setPokemons([searchedPokemon]);
      setTotal({...total, totalCount: 1});
    }

    setInitialLoading(false);
  }

  return (

    <div className={mainStyle.main}>
      <div className={mainStyle['search-section']}>
        <div className={mainStyle['search-bar']}>
          <FontAwesomeIcon icon={ faSearch } className={mainStyle['search-icon']}/>
          <input type="text" disabled={loading} value={search.searchString} placeholder={placeHolderText?.text || ''} onChange={(e) => checkCharEn(e)} onKeyUp={searchByPokemonName} />
          {search.searchString ? <FontAwesomeIcon icon={faTimes} className={mainStyle['reset-icon']} onClick={ resetSearchCondition }/> : null }
        </div>
      </div>

      {
        !search.isSearching ? 
          <div className={mainStyle['filter-container']}>
            <div className={mainStyle.count}>
              <p>{titleTxt?.text}</p>
              <span>{ total.totalCount }</span>
            </div>

            <PokemonFilter
              category={typeFilter}
              filterByType={filterByType}
            />
          </div>
        : null
      }

      { 
        pokemons.length === 0 && (!loading && initialLoading) ? <p className={mainStyle["no-result"]}>{lang === 'ko' ? '검색 결과가 없습니다.' : 'No Results'}</p> :
        <ul className={mainStyle['pokemon-list']}>
          {
            pokemons.map((pokemon, index) => { return <PokemonCard pokemon={pokemon} lang={lang} key={index} />})
          }
        </ul>
      }

      <div ref={target} className={mainStyle.loader}>
        { (loading && initialLoading) || (loading && !initialLoading) ? <p>Loading</p> : null}
      </div>
    </div>
  )
}



// 데이터가 있어야 화면을 그릴 수 있으므로 SSG 방식으로 렌더링 
export const getStaticProps: GetStaticProps = async(context) => {  const grassTypePokemon:TypeDetailApiRes = await fetch("https://pokeapi.co/api/v2/type/grass").then(res => res.json());
  const pokemons = grassTypePokemon.pokemon.filter(pokemon => !pokemon.pokemon.name.includes('starter') && !pokemon.pokemon.name.includes('dada') && !pokemon.pokemon.name.includes('totem'));
  const types: PokemonTypesApiRes = await fetch("https://pokeapi.co/api/v2/type").then(res => res.json());
  const filteredTypeByLang = await Promise.all(types.results.map(async (type) => {
  const typeRes = await fetch(type.url).then(res => res.json());

  const typesWithLang = await typeRes.names.filter((name: any) => name.language.name == 'ko' || name.language.name == 'ja-Hrkt' || name.language.name == 'en');
  const trimLangData = typesWithLang.map((t:PokemonName) => {
    if (t.language.name === 'ja-Hrkt') {
      return {
        ...t,
        code: typeRes.name,
        language: {
          ...t.language,
          name: 'ja'
        }
      }
    } else {
        return {
          ...t,
          code: typeRes.name,
        };
      }
    })
    return trimLangData;
  }));

  return {
    props: { data: pokemons, types: filteredTypeByLang }
  }
}

export default Main;