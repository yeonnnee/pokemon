import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FilterCategory } from '../hooks/useFilterCategory';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  searchWithFilters: (type:(string|null)[], gen:(string|null)[], enableGmax:boolean, enableMega: boolean) => void,
  filterCategory: FilterCategory[]
}


const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, searchWithFilters, filterCategory} = props;
  const filterIconRef = useRef<HTMLInputElement>(null);

  
  // filter 드롭다운 닫기
  function closeFilter() {
    if (!filterIconRef.current) return;
    filterIconRef.current.checked = false;
  }


  function getFilterConditions(categoryNm: string) {
    const checkedOptions = filterCategory.filter(options => options.category === categoryNm)[0];
    const options = checkedOptions.options.map(op => op.isChecked ? op.name : null).filter(op => op);
    return options;
  }

  function filterPokemon() {
    const typeConditions = getFilterConditions('타입');
    const generationConditions = getFilterConditions('세대');
    const formCondition = getFilterConditions('형태');
    const enableMega = formCondition.length > 0 && formCondition[0] === 'mega';
    const enableGmax = formCondition.length > 0 && formCondition[0] === 'gmax';

    searchWithFilters(typeConditions, generationConditions, enableGmax, enableMega);
    closeFilter()
  }



  return (
    <div className={mainStyle.filter}>
      <input type="checkbox" id="filter" className={mainStyle["filter-icon"]} ref={filterIconRef} />
      <label htmlFor="filter" className={mainStyle["filter-icon-label"]}>
        Filters <FontAwesomeIcon icon={faAngleDown} className={mainStyle['filter-arrow']}/>
      </label>
      
      <div className={mainStyle["filter-section"]}>
        <ul className={mainStyle.option}>
          {
            filterCategory.map((op, index) => {
              return (
                <li key={index} className={mainStyle.category}>
                  <div className={mainStyle["category-title"]}>
                    <Image width={20} height={20} src={`/pokeball.png`} alt={'icon'} />
                    <span>{op.category}</span>
                  </div>
                  <FilterOption category={op} />
                </li>
              )
            })
          }
          <li className={mainStyle.category}>
            <div className={mainStyle["filter-btn"]}>
            <button onClick={filterPokemon}>적용</button>
            <button onClick={closeFilter}>닫기</button>
            </div>

          </li>
        </ul>
      </div>
    </div>
  )
}

export default PokemonFilter;