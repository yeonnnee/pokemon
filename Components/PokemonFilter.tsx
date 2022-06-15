import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRef } from 'react';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  getGmaxPokemons: () => void,
  getMegaPokemons: () => void,
  searchByCategory: (type:string[], gen:string[]) => void,
  types: CustomPokemonType[]
}

export interface FilterOptions {
  category: string,
  options: CustomPokemonType[]
}

const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, searchByCategory, types, getGmaxPokemons, getMegaPokemons } = props;
  const filterIconRef = useRef<HTMLInputElement>(null);

  let typeConditions: string[] = [];
  let generationConditions: string[] = [];

  
  const generations = Array.from({ length: 7 }, (v, i) => {
    return {
      name: `${i + 1}`,
      nameKr: `${i + 1}세대 포켓몬`,
      url: ''
    }
  });


  const filterOptions:FilterOptions[] = [
    {
      category: '타입',
      options: types
    },
    {
      category: '세대',
      options: generations
    },
    {
      category: '형태',
      options: [
        {
          name: 'gmax',
          nameKr: '다이아맥스',
          url: ''
        },
        {
          name: 'mega',
          nameKr: '메가진화',
          url: ''
        },
      ]
    }
  ]

  // filter 드롭다운 닫기
  function closeFilter() {
    if (!filterIconRef.current) return;
    filterIconRef.current.checked = false;
  }


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
                  <FilterOption options={op.options} clickOption={filterType} />
                </li>
              )
            })
          }
          <li className={mainStyle.category}>
            <div className={mainStyle["filter-btn"]}>
            <button >적용</button>
            <button  onClick={closeFilter}>닫기</button>
            </div>

          </li>
        </ul>
      </div>
    </div>
  )
}

export default PokemonFilter;