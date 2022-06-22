import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef } from 'react';

import { Filter } from '../hooks/useFilter';
import mainStyle from '../styles/main.module.scss'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  searchWithFilters: (type:(string|null)[]) => void,
  category: Filter,
}


const PokemonFilter = (props: PokemonFilterProps) => {
  const { searchWithFilters, category } = props;

  const filterIconRef = useRef<HTMLInputElement>(null);
  const checkBoxRefs = useRef<HTMLInputElement[] | null[]>([]);
  const selectedOption = category.options.filter(op => op.isChecked)[0];

  console.log(category)

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


  function filterPokemon(option: string) {
    console.log(option);
    const checked = checkBoxRefs.current.filter(cur => cur.checked);
    console.log(checked);
    // const typeConditions = getFilterConditions('타입');
    // searchWithFilters(typeConditions);
    // closeFilter();
  }



  return (
    <div className={mainStyle.filter}>
      <p>Type</p>
      <input type="checkbox" id="filter" className={mainStyle["filter-icon"]} ref={filterIconRef} />
      <label htmlFor="filter" className={mainStyle["filter-icon-label"]}>
        {selectedOption?.name} <FontAwesomeIcon icon={faAngleDown} className={mainStyle['filter-arrow']}/>
      </label>
      
      <ul className={mainStyle["option-list"]}>
        {
          category.options.map((option, index) => {
            return (
              <li key={index} className={`${mainStyle.option}`}>
                <input type="checkbox" id={option.code} ref={el => (checkBoxRefs.current[index] = el)} />
                <label htmlFor={ option.code } onClick={()=>filterPokemon(option.code)}> {option.name} </label>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default PokemonFilter;