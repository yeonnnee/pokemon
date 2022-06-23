import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import NavStyle from '../../styles/nav.module.scss'

interface SupportedLanguage {
  name: string,
  code: string,
  url: string,
}

const Nav = () => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>({
    name: '한국어',
    code: 'ko',
    url: '/korea-icon.png',
  });
  const selectBoxRef = useRef<HTMLInputElement>(null);
  const Router = useRouter();
  const supportedLanguage = useMemo(() => getSupportedLanguage(),[]);


  function getSupportedLanguage() {
    return [
      {
        name: '한국어',
        code: 'ko',
        url: '/korea-icon.png',
      },
      {
        name: 'English',
        code: 'en',
        url: '/Usa-icon.png',
      },
      {
        name: '日本語',
        code: 'ja',
        url: '/Japan-icon.png',
      }
    ];
  }
  

  function changeLang(lang:SupportedLanguage) {
    setSelectedLang(lang);
    const currentPath = Router.query.pokemonName;
    const pathName = currentPath ? `/pokemon/${currentPath}` : '/';

    Router.push({ pathname: pathName, query: { lang: lang.code } });
    if (!selectBoxRef.current) return;
    selectBoxRef.current.checked = false;
  };

  useEffect(() => {
    const query = Router.query.lang;
    if (!query) return;
    setSelectedLang(supportedLanguage.filter(lang => lang.code === query)[0]);

  }, [Router, supportedLanguage]);

  return(
    <nav className={NavStyle.nav}>
      <div className={NavStyle.language}>
        <input type="checkbox" id="select-language" className={NavStyle["selected-lang-box"]} ref={selectBoxRef} />
        <label className={NavStyle["selected-lang"]} htmlFor="select-language">
          <Image width={20} height={20} src={selectedLang.url} alt={selectedLang.name} />
          <span>{`${selectedLang.name} (${selectedLang.code})`}</span>
          <FontAwesomeIcon icon={faAngleDown} className={NavStyle['drop-down-icon']}/>
        </label>

        <ul>
          {supportedLanguage.map((language, index) => {
            return (
              <li key={index} onClick={() => changeLang(language)}>
                <Image width={20} height={20} src={language.url} alt={language.name} />
                <span>{`${language.name} (${language.code})`}</span>
              </li>
            )
          })}
        </ul>
      </div>


      <div className={NavStyle.intro} >
        <Link href={`/?lang=${selectedLang.code}`}>
          <a>
            {/* <Image src="/main_logo.png" alt="logo" width={150} height={50} /> */}
            <span className={NavStyle.logo}>Pokédex</span>
          </a>
        </Link>
        <p className={NavStyle.desc}>What Pokémon are you looking for? <br /> Search for a Pokémon by name.</p>
      </div>
    </nav>
  )
}

export default Nav;