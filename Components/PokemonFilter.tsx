
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes'
import FilterOption from './FilterOption';


interface PokemonFilterProps {
  resetSearchCondition: () => void,
  setFilter: (category:string) => void,
  filter: string,
  types: CustomPokemonType[]
}

const PokemonFilter = (props: PokemonFilterProps) => {
  const { resetSearchCondition, setFilter, filter, types } = props;
  const generations = Array.from({ length: 7 }, (v, i) => {
    return {
      name: `generation-${i + 1}`,
      nameKr: `${i + 1}세대 포켓몬`,
      url: ''
    }
  });
  console.log(generations)

  return(
    <div className={mainStyle["filter-section"]}>

      <ul className={mainStyle.option}>
        <li className={mainStyle["active"]} onClick={resetSearchCondition}>전체</li>
        <li onClick={()=>setFilter('category')}>카테고리</li>
        <li onClick={()=>setFilter('mega')}>메가진화 포켓몬</li>
        <li onClick={()=>setFilter('gmax')}>다이맥스 포켓몬</li>
      </ul>

      <div className={filter === 'category' ? mainStyle["category-container"] : mainStyle.hidden}>
        <ul className={mainStyle["category-list"]}>
          <FilterOption category={'타입'} options={types} />
          <FilterOption category={'세대'} options={generations} />
        </ul>
        <div className={mainStyle["filter-btn"]}>
          <button>필터 적용</button>
        </div>
      </div>
    </div>
  )
}

export default PokemonFilter;