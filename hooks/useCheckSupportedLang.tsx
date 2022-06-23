import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useCheckSupportedLang() {
  const Router = useRouter();
  const [lang, setLang] = useState('');

  useEffect(() => {
    const query = Router.query.lang as string;
    const supportedLang = ['ko', 'en', 'ja'];
    
    const currentPath = Router.query.pokemonName;
    const pathName = currentPath ? `/pokemon/${currentPath}` : '/';
    if (!query || !supportedLang.includes(query)) Router.push({ pathname: pathName, query: { lang: 'ko' } });

    setLang(query);
  }, [Router]);

  return lang;
}


export default useCheckSupportedLang;