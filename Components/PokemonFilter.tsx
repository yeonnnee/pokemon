import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef } from 'react';

import { Filter, OptionItem } from '../hooks/useFilter';
import mainStyle from '../styles/main.module.scss'
// import FilterOption from './FilterOption';


interface PokemonFilterProps {
  filterByType: (type:string) => void,
  category: Filter,
}


const PokemonFilter = (props: PokemonFilterProps) => {
  const { filterByType, category } = props;

  const filterIconRef = useRef<HTMLInputElement>(null);
  const checkBoxRefs = useRef<HTMLInputElement[] | null[]>([]);
  const selectedOption = category.options.filter(op => op.isChecked)[0];

  console.log('filter', category);

  // filter 드롭다운 닫기
  function closeFilter() {
    if (!filterIconRef.current) return;
    filterIconRef.current.checked = false;
  }

  function cancelCheckBoxChecked() {
    checkBoxRefs.current.forEach(ref => {
      if (!ref) return;
      ref.checked = false;
    });
  }


  function filterPokemon(option: OptionItem) {
    cancelCheckBoxChecked();
    category.fn(category.options, option);
    filterByType(option.code);

    closeFilter();
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
                <input type="checkbox" id={option.code} onChange={() => filterPokemon(option)} checked={option.isChecked} ref={el => (checkBoxRefs.current[index] = el)} />
                <label htmlFor={ option.code } >{option.name} </label>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default PokemonFilter;