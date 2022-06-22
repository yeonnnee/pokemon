import { useCallback, useEffect, useState } from "react";
import { PokemonName } from "../types/speices";

export interface OptionItem extends PokemonName {
  code: string;
  isChecked: boolean;
}

export interface Filter {
  category: string,
  options: OptionItem[],
  fn: ( option: OptionItem, ref: HTMLInputElement | null, options?: OptionItem[] | undefined) => void
}


function useFilter(types: OptionItem[][], lang:string) {
  const [filter, setFilter] = useState<Filter>(null);

  function selectOption(option:OptionItem, ref:HTMLInputElement | null) {
    option.isChecked = !option.isChecked;
  }

  function getFilterOptionObj(category:string, options:OptionItem[], fn:( option: OptionItem, ref: HTMLInputElement | null ) => void) {

    return {
      category: category,
      options: options,
      fn: fn
    }
  }

  const getFilterOptions = useCallback(() => {
    if (!lang) return;

    const filteredTypesByLang = types.map(typeInfo => typeInfo.filter(t => t.language.name === lang)[0]);
    const typeOptions = filteredTypesByLang.map(filteredType => { return { ...filteredType, isChecked: filteredType.code === 'grass' } });
    const typeFilter = getFilterOptionObj('Type', typeOptions, selectOption);
    setFilter(typeFilter);

  }, [types, lang]);



  useEffect(() => {
    if (filter) return;
    
    getFilterOptions();
  }, [getFilterOptions, filter]);

  return filter;
}

export default useFilter;