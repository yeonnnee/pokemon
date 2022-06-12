
import { type } from 'os';
import { createRef, Ref, RefObject, useRef } from 'react';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  setFilter: (category: string) => void,
  getGmaxPokemons: () => void,
  getMegaPokemons:()=> void,
  filter: string,
  types: CustomPokemonType[]
}

const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, setFilter, filter, types, getGmaxPokemons, getMegaPokemons } = props;

  
  const generations = Array.from({ length: 7 }, (v, i) => {
    return {
      name: `${i + 1}`,
      nameKr: `${i + 1}세대 포켓몬`,
      url: ''
    }
  });

  function filterPokemon() {
   
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
          <FilterOption category={'타입'} options={types} />
          <FilterOption category={'세대'} options={generations} />
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