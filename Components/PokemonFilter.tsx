import React, { Dispatch, SetStateAction } from 'react';
import { SearchState } from '../pages';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  setFilter: (category: string) => void,
  getGmaxPokemons: () => void,
  getMegaPokemons: () => void,
  // setSearch: Dispatch<SetStateAction<SearchState>>,
  searchByCategory: (type:string[], gen:string[]) => void,
  filter: string,
  types: CustomPokemonType[]
}

const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, setFilter,searchByCategory, filter, types, getGmaxPokemons, getMegaPokemons } = props;
  let typeConditions: string[] = [];
  let generationConditions: string[] = [];
  
  const generations = Array.from({ length: 7 }, (v, i) => {
    return {
      name: `${i + 1}`,
      nameKr: `${i + 1}세대 포켓몬`,
      url: ''
    }
  });

  function filterPokemon() {
    searchByCategory(typeConditions, generationConditions);
  }

  function filterType(e: React.MouseEvent<HTMLLabelElement>) {
    const target = e.target as HTMLLabelElement;
    const type = target.htmlFor;
    if (typeConditions.includes(type)) {
      typeConditions = typeConditions.filter(condition => condition !== type);
    } else {
      typeConditions.push(type);
    }
  }

  function filterGeneration(e: React.MouseEvent<HTMLLabelElement>) {
    const target = e.target as HTMLLabelElement;
    const generation = target.htmlFor;
    if (generationConditions.includes(generation)) {
      generationConditions = generationConditions.filter(gen => gen !== generation);
    } else {
      generationConditions.push(generation);
    }
  }

  return(
    <div className={mainStyle["filter-section"]}>

      <ul className={mainStyle.option}>
        <li className={filter === 'all' ? mainStyle["active"] : ''} onClick={resetSearchCondition}>전체</li>
        <li className={filter === 'category' ? mainStyle["active"] : ''} onClick={()=>setFilter('category')}>카테고리</li>
        <li className={filter === 'megaPokemon' ? mainStyle["active"] : ''} onClick={getMegaPokemons}>메가진화 포켓몬</li>
        <li className={filter === 'gmaxPokemon' ? mainStyle["active"] : ''} onClick={getGmaxPokemons}>다이맥스 포켓몬</li>
      </ul>

      <div className={filter === 'category' ? mainStyle["category-container"] : mainStyle.hidden}>
        <ul className={mainStyle["category-list"]}>
          <FilterOption category={'타입'} options={types} clickOption={filterType} />
          <FilterOption category={'세대'} options={generations} clickOption={filterGeneration} />
        </ul>
        <div className={mainStyle["filter-btn"]}>
          <button onClick={filterPokemon}>필터 적용</button>
          {/* <button>닫기</button> */}
        </div>
      </div>
    </div>
  )
}

export default PokemonFilter;