import { useCallback, useEffect, useState } from "react";
import { PokemonType } from "../types/detail";
import { TypeDetailApiRes } from "../types/pokemonTypes";

function useTypeTranslate(types: PokemonType[], lang) {
  const [supportLang, setSupportLang] = useState('');
  const [translatedTypes, setTranslatedTypes] = useState<string[]>([]);
  

  const convertTypeName = useCallback(async () => {
    if (lang !== 'en') {
      const typeNm = await Promise.all(types.map(async (type) => {
        const res:TypeDetailApiRes = await fetch(type.type.url).then(res => res.json());
        const name = res.names.filter(name => name.language.name === lang)[0].name;
        return name;
      }));
      setTranslatedTypes(typeNm);

    } else {
      setTranslatedTypes(types.map(type => type.type.name.toUpperCase()));
    }

  }, [types, lang]);

  useEffect(() => {
    if (supportLang === lang) return;
    setSupportLang(lang);
    convertTypeName();

  }, [supportLang, lang, convertTypeName ]);
  return translatedTypes;
}

export default useTypeTranslate;