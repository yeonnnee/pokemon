import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes';

interface FilterOptionProps {
  options: CustomPokemonType[],
  clickOption: (e:React.MouseEvent<HTMLLabelElement>) => void
}

const FilterOption = (props: FilterOptionProps) => {
  const { options, clickOption} = props;

  return(
    <div className={mainStyle["option-list"]}>
      {
        options.map((option, index) => {
          return (
            <div key={index} className={`${mainStyle.item}`}>
              <input type="checkbox" id={option.name} />
              <label htmlFor={ option.name } onClick={clickOption}> {option.nameKr} </label>
            </div>
          )
        })
      }
    </div>

  )
}

export default FilterOption;