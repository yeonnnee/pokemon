import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { EvolutionData, PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../../types/detail";
import { PokemonName, PokemonSpeciesApiRes } from "../../../types/speices";
import { AbilityApiRes } from "../../../types/ability";
import usePokemonIdx from "../../../hooks/usePokemonIdx";
import { EvolutionApiRes } from "../../../types/evolution";
import Link from "next/link";
import ImageSection from "../../../Components/ImageSection";
import DefaultInfo from "../../../Components/DefaultInfo";
import DetailInfo from "../../../Components/DetailInfo";
import AbilityInfo from "../../../Components/AbilityInfo";
import EvolutionInfo from "../../../Components/EvolutionInfo";
import Loader from "../../../Components/common/Loader";
import { PokemonsApiRes, ResourceForPokemon } from "../../../types/pokemons";
import { GetStaticProps } from "next";
import { loadPokemonInfo, sectionTitleName } from "../../../translate/text";
import RadarChart from "../../../Components/common/RadarChart";
import useOutsideClick from "../../../hooks/useClickOutside";


interface DetailProps {
  data: {
    detail: PokemonDetailApiRes,
    species: PokemonSpeciesApiRes,
    isMega: string[],
    isGmax: string[],
  }
}

const Detail = (props: DetailProps) => {
  const router = useRouter();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('');
  const [stats, setStats] = useState<PokemonStat[]>([]);
  const [totalStat, setTotalStat] = useState<number>(0);

  const translation = sectionTitleName.filter(category => category.language === lang);
  const queryPokemonNm = router.query.pokemonName as string;
  const pokemonIdx = usePokemonIdx( queryPokemonNm.includes('gmax') ? -1 : data?.id || 0);
  const loadPokemonInfoTxt = loadPokemonInfo.filter(text => text.language === lang)[0]?.text;
  
  const convertStatName = (name: string) => {
    switch (name) { 
      case 'hp' : return 'Hp';
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'special-attack': return 'Sp.Attack';
      case 'special-defense': return 'Sp.Defense';
      case 'speed': return 'Speed';
      default: return '';
    }
  }
  

  const getEvolutionData = useCallback(async (url: string | null, seq: number) => {
    const initialData = { id: 0, name: null, translatedNm: null, image: null };
    if (!url) return initialData;

    const result = await fetch(url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: seq,
        name: data.name,
        translatedNm: data.names.filter(name => name.language.name === lang)[0].name,
        image: detail.sprites.front_default,
      }
    });
    return result;
  }, [lang]);


  const getEvolutionChain = useCallback(async (url: string) => {
    const res: EvolutionApiRes = await fetch(url).then(data => data.json());
    const evolutionChain = res.chain.evolves_to;
    const initialData = [{ id: 0, name: null, translatedNm: null, image: null }];

    if (evolutionChain.length === 0) return [initialData];

    if (evolutionChain.length > 1) {
      // 이브이 진화
      let cases: EvolutionData[][] = [];
      const origin = await getEvolutionData(res.chain.species.url, 1);
      const evolutionCases = await Promise.all(evolutionChain.map(async (chain, index) => {
        const info = await getEvolutionData(chain.species.url, index + 2);
        return {
          ...info,
          item: chain.evolution_details[0].item
        }
      }));
      

      evolutionCases.forEach(data => {
        if (data.name) {
          cases.push([origin, data]);
        }
      });

      return cases;
    } else {
      const beforeLevelUp = await getEvolutionData(res.chain.species.url, 1);
      const firstLevelUp = await getEvolutionData(evolutionChain[0].species.url, 2);
      const lastLevelUp = await getEvolutionData(evolutionChain[0].evolves_to[0]?.species.url, 3);

      if (props.data.isMega.length > 0) {
        const mega = await Promise.all(props.data.isMega.map(async (megaName, index) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaName}`).then(res => res.json());
          const megaEvolution = {
            id: 3 + index + 1,
            name: res.name,
            translatedNm: lang === 'ko' ? `메가${lastLevelUp.translatedNm}` : `メガ${lastLevelUp.translatedNm}`,
            image: res.sprites.front_default,
            
          };
          return megaEvolution;
        })); 
       
        return mega.map(megaEvolution => [beforeLevelUp, firstLevelUp, lastLevelUp, megaEvolution].filter(info => info.name));
      } else {
        return [[beforeLevelUp, firstLevelUp, lastLevelUp,].filter(info => info.name)];
      }

    }

  }, [getEvolutionData, lang, props]);

  const getPokemonForm = useCallback((pokemonName: string) => {
    let label:string = '';
    const rapid = pokemonName.includes('rapid-strike'); // 연격의 태세
    const single = pokemonName.includes('single-strike'); // 일격의 태세
    const large = pokemonName.includes('large');
    const average = pokemonName.includes('average');
    const superSize = pokemonName.includes('super');
    const small = pokemonName.includes('small');
    const percentage = pokemonName.includes('50') || pokemonName.includes('10');
    const complete = pokemonName.includes('complete');

    if (rapid) label = lang === 'ko' ? '(연격의 태세)' : '(いちげきのかた)';
    if (single) label = lang === 'ko' ? '(일격의 태세)' : '(れんげきのかた)';
    if (large) label = '(L)';
    if (small) label = '(S)';
    if (average) label = '(Average)';
    if (superSize) label = '(Super)';
    if (percentage) label = lang === 'ko' ? `(${pokemonName.split('-')[1]}%폼)` : '';
    if (complete) label = lang === 'ko' ? `(퍼펙트폼)` : '';

    return label;
  }, [lang]);


  const getFullName = useCallback((name: string) => {
    const pokemonNameEn = props.data.detail.name;
    const isMega = pokemonNameEn.includes('mega');
    const nameArr = pokemonNameEn.split('-');
    const megaText = lang === 'ko' ? '메가' : 'メガ';
    const form = getPokemonForm(pokemonNameEn);

    if (isMega) {
      if (nameArr.length > 2) {
        const megaKeywordIdx = form.indexOf('mega');
        return `${megaText}${name}-${form[megaKeywordIdx + 1].toUpperCase()}`;
      } else {
        return `${megaText}${name}`;
      }
    }

    return form ? `${name} ${form}` : name;
  }, [props.data, getPokemonForm, lang]);


  const customData = useCallback(async (detailData:PokemonDetailApiRes, speciesData: PokemonSpeciesApiRes) => {
    if (!speciesData || !detailData) return;
    const translatedNm = speciesData.names.filter(name => name.language.name === lang)[0].name;
    const fullname = lang !== 'en' ? getFullName(translatedNm) : translatedNm;
    const pokemonDesc = speciesData.flavor_text_entries.filter(text => text.language.name === lang);
    const evolutionChain = await getEvolutionChain(speciesData.evolution_chain.url);
  
    const abilitiesKr = await Promise.all(detailData.abilities.map(async (ability) => {
      const abilityDetail: AbilityApiRes = await fetch(ability.ability.url).then(data => data.json());
      const result = abilityDetail.flavor_text_entries.filter(effect => effect.language.name === lang);
      return {
        text: result[0].flavor_text,
        name: abilityDetail.names.filter(name => name.language.name === lang)[0],
        isHidden: ability.is_hidden
      };
    }));

    const stats = detailData.stats.map(stat => {
      return {
        ...stat,
        label: convertStatName(stat.stat.name),
      }
    });

    const result = {
      name: speciesData.name,
      translatedNm: fullname, 
      desc: pokemonDesc,
      id: detailData.id,
      weight: detailData.weight,
      height: detailData.height,
      types: detailData.types,
      images: detailData.sprites,
      evloution_chain: evolutionChain,
      abilitiesKr: abilitiesKr,
      capture_rate: speciesData.capture_rate,
      growth_rate: speciesData.growth_rate,
      flavor_text_entries: speciesData.flavor_text_entries,
      genera: speciesData.genera.filter(genera => genera.language.name === lang),
      generation: speciesData.generation,
      has_gender_differences: speciesData.has_gender_differences,
      is_legendary: speciesData.is_legendary,
      stats: stats
    };

    let total: number = 0;
    stats.forEach(stat => total = total + stat.base_stat);
    setLoading(false);
    setData(result);
    setStats(result.stats);
    setTotalStat(total);

  }, [getEvolutionChain, getFullName, lang]);

  function goToMain() {
    router.push(`/?lang=${lang}`);
  }

  useEffect(() => {
    const query = router.query.lang as string;
    setLang(query);

    if (!lang) return;
    customData(props.data.detail, props.data.species);

  }, [customData, props.data, lang, router]);

  return (
    <>
      {!data ? <Loader text={loadPokemonInfoTxt} /> :
        <div className={detailStyle.detail}>
          <div className={detailStyle.container}>
            <ImageSection images={data.images} lang={lang} pokemonIdx={pokemonIdx} pokemonName={ data.translatedNm } desc={data.desc} sectionTitle={translation.filter(category => category.category === 'desc')[0].text } />
        
            <section className={detailStyle["pokemon-info-section"]}>
              {/* 기본정보 */}
              <DefaultInfo lang={lang} sectionTitle={translation.filter(category => category.category === 'default info')[0].text} image={data.images.front_default} pokemonName={data.translatedNm} pokemonIdx={pokemonIdx} types={data.types} />

              {/* 세부정보 */}
              <DetailInfo lang={lang} genera={data.genera[0].genus} height={data.height} weight={data.weight} captureRate={data.capture_rate} sectionTitle={translation.filter(category => category.category === 'detail info')[0].text}/>

              {/* 특성 */}
              <AbilityInfo lang={lang} abilities={data.abilitiesKr} sectionTitle={translation.filter(category => category.category === 'ability')[0].text}/>

              {/* 진화 */}
              <EvolutionInfo lang={lang} evolution={data.evloution_chain} sectionTitle={translation.filter(category => category.category === 'evolution')[0].text} />

              {/* 종족치 */}
              <div className={` ${detailStyle.section}`}>
                <div className={detailStyle["section-title"]}>
                  <span>{translation.filter(category => category.category === 'stat')[0].text}</span>
                  <p className={detailStyle.total}>
                    <span>Total</span>: <span>{totalStat}</span>
                  </p>
                </div>
                <div className={detailStyle["chart-section"]}>
                  <RadarChart chartData={ stats } />
                </div>
              </div>
            </section>
          </div>
          <div className={detailStyle["btn-section"]}>
              <button onClick={goToMain} className={detailStyle.btn}>{lang === 'ko' ? '목록으로' : 'Main'}</button>
          </div>
        </div>
      }
    </>
  )
}

// 데이터기반으로 얼만큼의 html 페이지가 필요한지를 알려주기 위해 getStaticPaths 사용
export async function getStaticPaths() {
  const totalCount = await fetch("https://pokeapi.co/api/v2/pokemon?limit=0&offset=0").then(res => res.json());
  const res:PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount.count}&offset=0`).then(res => res.json());
  const pokemons = res.results;

  const paths = pokemons.map(pokemon => {
    return {
      params: { pokemonName: pokemon.name, pokemons },
    }
  });

  return {
    paths,
    fallback: false // path와 일치되지 않는 경우 404 반환
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pokemonName = context.params?.pokemonName;
  
  const totalCount = await fetch("https://pokeapi.co/api/v2/pokemon?limit=0&offset=0").then(res => res.json());
  const res:PokemonsApiRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount.count}&offset=0`).then(res => res.json());
  const pokemons = res.results;

  // Form 정보
  const forms = pokemonName ? pokemons.map(pokemon => {if(pokemon.name.includes(pokemonName as string)) {return pokemon.name}}) : [];
  const isMega = forms.filter(form => form?.includes('mega'));
  const isGmax = forms.filter(form => form?.includes('gmax'));

  // 포켓몬 정보
  const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(res => res.json());
  const species = await fetch(detail.species.url).then(res => res.json());


  return {
    props: { data: {detail, species, isMega, isGmax} }
  }
}

export default Detail;