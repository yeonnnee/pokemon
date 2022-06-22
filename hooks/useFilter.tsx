import { useCallback, useEffect, useState } from "react";
import { PokemonName } from "../types/speices";

export interface OptionItem extends PokemonName {
  code: string;
  isChecked: boolean;
}

export interface Filter {
  category: string,
  options: OptionItem[],
  fn: (options:OptionItem[], option: OptionItem) => void;
}


function useFilter(types: OptionItem[][], lang:string) {
  const [filter, setFilter] = useState<Filter>(null);
  const [supportLang, setSupportLang] = useState('');

  function selectOption(options:OptionItem[], selectedOption: OptionItem) {
    options.forEach(option => {
      if (option.code === selectedOption.code) {
        option.isChecked = true;
      } else {
        option.isChecked = false;
      }
    });
  }

  const getFilterOptionObj = useCallback( (category:string, options:OptionItem[])=> {

    return {
      category: category,
      options: options,
      fn: selectOption
    }
  }, []);

  const getFilterOptions = useCallback(() => {
    if (!lang) return;

    const filteredTypesByLang = types.map(typeInfo => typeInfo.filter(t => t.language.name === lang)[0]);
    const typeOptions = filteredTypesByLang.map(filteredType => { return { ...filteredType, isChecked: filteredType.code === 'grass' } });
    const typeFilter = getFilterOptionObj('Type', typeOptions);
    setFilter(typeFilter);

  }, [types, lang,getFilterOptionObj]);



  useEffect(() => {
    if (supportLang === lang) return;
    
    getFilterOptions();
  }, [getFilterOptions, supportLang, lang]);

  return filter;
}

export default useFilter;