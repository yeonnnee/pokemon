import { useCallback, useEffect, useState } from "react";
import { CustomPokemonType } from "../types/pokemonTypes";


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


function useFilterCategory( types:CustomPokemonType[]) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory[]>([]);
  


  function getOptionItem(name: string, nameKr: string, url: string, isChecked: boolean):OptionItem {
    return {
      name: name,
      nameKr: nameKr,
      url: url,
      isChecked: isChecked
    }
  }

  function selectMultiOption(option: OptionItem, ref: HTMLInputElement | null) {
    option.isChecked = !option.isChecked;
  }

  function selectSingleOption(option: OptionItem, ref: HTMLInputElement | null) {
    if (!ref) return;

    ref.checked = false;
    option.isChecked = !option.isChecked;
  }

  function getFilterOptionObj(category: string, options: OptionItem[], isMulti:boolean, fn: (option: OptionItem, ref: HTMLInputElement | null)=>void) {
    return {
      category: category,
      options: options,
      isMulti: isMulti,
      fn:fn 
    }
  }

  const getFilterOptions = useCallback(() => {
    const generations = Array.from({ length: 7 }, (v, i) => {
      return {
        name: `${i + 1}`,
        nameKr: `${i + 1}세대 포켓몬`,
        url: '',
        isChecked: false,
      }
    });

    const filterOptions: FilterCategory[] = [
      getFilterOptionObj('타입', types.map(type => { return { ...type, isChecked: false } }), true, selectMultiOption),
      getFilterOptionObj('세대', generations, true, selectMultiOption),
      getFilterOptionObj('형태', [getOptionItem('gmax', '다이아맥스', '', false), getOptionItem('mega', '메가진화', '', false)], false, selectSingleOption),
    ];

    setFilterCategory(filterOptions);
  }, [types]);



  useEffect(() => {
    getFilterOptions();
  }, [getFilterOptions]);
  return filterCategory;
}

export default useFilterCategory;