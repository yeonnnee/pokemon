import { useCallback, useEffect, useState } from "react";
import { categoryName } from "../translate/text";
import { PokemonName } from "../types/speices";

export interface OptionItem extends PokemonName {
  code: string;
  isChecked: boolean;
}

export interface FilterCategory {
  category: string,
  options: OptionItem[],
  isMulti: boolean,
  fn: ( option: OptionItem, ref: HTMLInputElement | null, options?: OptionItem[] | undefined) => void
}


function useFilterCategory( types:OptionItem[]) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory[]>([]);

  function selectMultiOption(option:OptionItem, ref:HTMLInputElement | null) {
    option.isChecked = !option.isChecked;
  }

  function getFilterOptionObj(category:string, options:OptionItem[], isMulti:boolean, fn:( option: OptionItem, ref: HTMLInputElement | null, options?: OptionItem[] | undefined ) => void) {

    return {
      category: category,
      options: options,
      isMulti: isMulti,
      fn:fn 
    }
  }

  const getFilterOptions = useCallback(() => {
    const lang = types[0]?.language.name;
    const categories = categoryName.filter(category => category.language === lang);
    const translatedCategoryNm = categories.filter(categoryList => categoryList.category === 'type')[0];

    const filterOptions: FilterCategory[] = [
      getFilterOptionObj(translatedCategoryNm?.text, types.map(type => { return { ...type, isChecked: type.code === 'grass' } }), true, selectMultiOption),
    ];

    setFilterCategory(filterOptions);
  }, [types]);



  useEffect(() => {
    getFilterOptions();
  }, [getFilterOptions]);
  return filterCategory;
}

export default useFilterCategory;