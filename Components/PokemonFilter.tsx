import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRef, useState } from 'react';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  getGmaxPokemons: () => void,
  getMegaPokemons: () => void,
  searchWithFilters: (type:string[], gen:string[], enableGmax:boolean, enableMega: boolean) => void,
  types: CustomPokemonType[]
}

export interface OptionItem {
  name: string;
  nameKr: string;
  url: string;
  isChecked: boolean;
}

export interface FilterCategory {
  category: string,
  options: OptionItem[],
  isMulti: boolean,
  fn: (option: OptionItem, ref: HTMLInputElement | null) => void
}


const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, searchWithFilters, types, getGmaxPokemons, getMegaPokemons } = props;
  const [checkedTypes, setCheckedTypes] = useState<string[]>([]);
  const [checkedGenerations, setCheckedGenerations] = useState<string[]>([]);
  const filterIconRef = useRef<HTMLInputElement>(null);


  let enableMega:boolean = false;
  let enableGmax:boolean = false;
  
  const generations = Array.from({ length: 7 }, (v, i) => {
    return {
      name: `${i + 1}`,
      nameKr: `${i + 1}세대 포켓몬`,
      url: '',
      isChecked: false,
    }
  });


  

  // filter 드롭다운 닫기
  function closeFilter() {
    if (!filterIconRef.current) return;
    filterIconRef.current.checked = false;
  }


  function filterPokemon() {
    // searchWithFilters(typeConditions, generationConditions, enableGmax, enableMega);
  }

  function selectType(option: OptionItem, ref: HTMLInputElement | null) {
    option.isChecked = !option.isChecked;

    console.log(filterOptions[0].options)
  }

  function selectGeneration(option: OptionItem, ref: HTMLInputElement | null) {
    option.isChecked = !option.isChecked;
  }

  function selectForm(option: OptionItem, ref: HTMLInputElement | null) {
    if (!ref) return;

    ref.checked = false;
    option.isChecked = !option.isChecked;
  }

  function getOptionItem(name: string, nameKr: string, url: string, isChecked: boolean):OptionItem {
    return {
      name: name,
      nameKr: nameKr,
      url: url,
      isChecked: isChecked
    }
  }

  function getFilterOptionObj(category: string, options: OptionItem[], isMulti:boolean, fn: (option: OptionItem, ref: HTMLInputElement | null)=>void) {
    return {
      category: category,
      options: options,
      isMulti: isMulti,
      fn:fn 
    }
  }

  const filterOptions: FilterCategory[] = [
    getFilterOptionObj('타입', types.map(type => { return { ...type, isChecked: false } }), true, selectType),
    getFilterOptionObj('세대', generations, true, selectGeneration),
    getFilterOptionObj('형태', [getOptionItem('gmax', '다이아맥스', '', false), getOptionItem('mega', '메가진화', '', false)], false, selectForm),
  ];


  return (
    <div className={mainStyle.filter}>
      <input type="checkbox" id="filter" className={mainStyle["filter-icon"]} ref={filterIconRef} />
      <label htmlFor="filter" className={mainStyle["filter-icon-label"]}>
        Filters <FontAwesomeIcon icon={faAngleDown} className={mainStyle['filter-arrow']}/>
      </label>
      
      <div className={mainStyle["filter-section"]}>
        <ul className={mainStyle.option}>
          {
            filterOptions.map((op, index) => {
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
            <button >적용</button>
            <button onClick={closeFilter}>닫기</button>
            </div>

          </li>
        </ul>
      </div>
    </div>
  )
}

export default PokemonFilter;