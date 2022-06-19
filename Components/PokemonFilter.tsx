import { faAngleDown, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { MutableRefObject, useRef } from 'react';
import { FilterCategory } from '../hooks/useFilterCategory';
import mainStyle from '../styles/main.module.scss'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  searchWithFilters: (type:(string|null)[], gen:(string|null)[], enableGmax:boolean, enableMega: boolean, isAll: boolean) => void,
  filterCategory: FilterCategory[],
}


const PokemonFilter = (props: PokemonFilterProps) => {
  const { searchWithFilters, filterCategory } = props;
  const lang = filterCategory[0].options[0].language.name;
  const filterIconRef = useRef<HTMLInputElement>(null);
  const typeCheckBoxRefs = useRef<HTMLInputElement[] | null[]>([]);

  
  // filter 드롭다운 닫기
  function closeFilter() {
    if (!filterIconRef.current) return;
    filterIconRef.current.checked = false;
  }

  function cancelCheckBoxChecked(refs: MutableRefObject<HTMLInputElement[] | null[]>) {
    refs.current.forEach(ref => {
      if (!ref) return;
      ref.checked = false;
    });
  }

  function resetFilterCondition() {
    filterCategory.forEach(op => op.options.forEach(option => option.isChecked = false));
    cancelCheckBoxChecked(typeCheckBoxRefs);
  }

  function getRefs(op: FilterCategory) {
    switch (op.category) {
      case 'type': return typeCheckBoxRefs;
      default: return typeCheckBoxRefs;
    }
  }

  function getFilterConditions(categoryNm: string) {
    const checkedOptions = filterCategory.filter(options => options.category === categoryNm)[0];
    const options = checkedOptions.options.map(op => op.isChecked ? op.name : null).filter(op => op);
    return options;
  }

  function filterPokemon() {
    const typeConditions = getFilterConditions('타입');
    // searchWithFilters(typeConditions, generationConditions, enableGmax, enableMega, isAll);
    closeFilter();
  }



  return (
    <div className={mainStyle.filter}>
      <input type="checkbox" id="filter" className={mainStyle["filter-icon"]} ref={filterIconRef} />
      <label htmlFor="filter" className={mainStyle["filter-icon-label"]}>
        Filters <FontAwesomeIcon icon={faAngleDown} className={mainStyle['filter-arrow']}/>
      </label>
      
      <div className={mainStyle["filter-section"]}>
        <ul className={mainStyle.option}>
          <li className={mainStyle.category}>
            <button onClick={resetFilterCondition}>{ lang === 'ko'? '초기화' : 'Reset' }</button>
            <FontAwesomeIcon onClick={resetFilterCondition} icon={faRedoAlt} className={mainStyle['reset-icon']}/>
          </li>
          {
            filterCategory.map((op, index) => {
              return (
                <li key={index} className={mainStyle.category}>
                  <div className={mainStyle["category-title"]}>
                    <Image width={20} height={20} src={`/pokeball.png`} alt={'icon'} />
                    <span>{op.category}</span>
                  </div>
                  <FilterOption category={op} checkBoxRefs={getRefs(op)} />
                </li>
              )
            })
          }
          <li className={mainStyle.category}>
            <div className={mainStyle["filter-btn"]}>
              <button onClick={filterPokemon}>{ lang === 'ko'? '적용' : 'Filter' }</button>
              <button onClick={closeFilter}>{ lang === 'ko'? '닫기' : 'Close' }</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PokemonFilter;