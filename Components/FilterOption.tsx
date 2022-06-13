import React, { ForwardedRef, Ref, RefObject, useRef } from 'react';
import mainStyle from '../styles/main.module.scss'
import { CustomPokemonType } from '../types/pokemonTypes';

interface FilterOptionProps {
  category: string,
  options: CustomPokemonType[],
  clickOption: (e:React.MouseEvent<HTMLLabelElement>) => void
}

const FilterOption = (props: FilterOptionProps) => {
  const { category, options, clickOption} = props;

  return(
    <li className={mainStyle["option-list"]}>
      <p>{category}</p>
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
  </li>

  )
}

FilterOption.displayName = "FilterOption";

export default FilterOption;