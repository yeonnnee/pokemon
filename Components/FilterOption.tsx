import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes';

interface FilterOptionProps {
  category: string,
  options: CustomPokemonType[],
}

const FilterOption = (props: FilterOptionProps) => {
  const { category, options  } = props;

  return(
    <li className={mainStyle["type-list"]}>
      <p>{category}</p>
    {
      options.map((option, index) => {
        return (
          <div key={index} className={ mainStyle["item"] }>
            <input type="radio" id={option.name}/>
            <label htmlFor={ option.name }> {option.nameKr} </label>
          </div>
        )
      })
    }
  </li>

  )
}

export default FilterOption;