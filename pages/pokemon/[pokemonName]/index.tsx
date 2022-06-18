import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { EvolutionData, PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../../types/detail";
import { PokemonSpeciesApiRes } from "../../../types/speices";
import { AbilityApiRes } from "../../../types/ability";
import usePokemonIdx from "../../../hooks/usePokemonIdx";
import { EvolutionApiRes } from "../../../types/evolution";
import Link from "next/link";
import ImageSection from "../../../components/ImageSection";
import DefaultInfo from "../../../components/DefaultInfo";
import DetailInfo from "../../../components/DetailInfo";
import AbilityInfo from "../../../components/AbilityInfo";
import EvolutionInfo from "../../../components/EvolutionInfo";
import Loader from "../../../components/common/Loader";
import { PokemonsApiRes, ResourceForPokemon } from "../../../types/pokemons";
import { GetStaticProps } from "next";

interface DetailProps {
  data: {
    detail: PokemonDetailApiRes,
    species: PokemonSpeciesApiRes,
    isMega: boolean,
    isGmax: boolean,
    hasDifferVersion: boolean
  }

}

const Detail = (props: DetailProps) => {
  const router = useRouter();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonIdx = usePokemonIdx(data?.id || 0);

  const barRef = useRef<HTMLDivElement[] | null[]>([]);

  const paintGraphBar = useCallback((result:PokemonDetail | null) => {
    if (!result || loading) return;
    const stats = result.stats.map(stat => stat.base_stat);

    barRef.current.forEach((ref, index) => {
      if (!ref) return;
      ref.style.width = `${(stats[index] && stats[index] > 100) ? 100 : stats[index]}%`
    });
  }, [loading]);

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
    const initialData = { id: 0, name: null, nameKr: null, image: null };
    if (!url) return initialData;

    const result = await fetch(url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: seq,
        name: data.name,
        nameKr: data.names.filter(name => name.language.name === 'ko')[0].name,
        image: detail.sprites.front_default,
      }
    });
    return result;
  }, []);


  const getEvolutionChain = useCallback(async (url: string) => {
    const res: EvolutionApiRes = await fetch(url).then(data => data.json());
    const evolutionChain = res.chain.evolves_to;
    const initialData = [{ id: 0, name: null, nameKr: null, image: null }];

    if (evolutionChain.length === 0) return [initialData];


    if (evolutionChain.length > 1) {
      // 이브이 진화
      let cases: EvolutionData[][] = [];
      const evolutionCases = await Promise.all(evolutionChain.map(async (chain, index) => {
        const info = await getEvolutionData(chain.species.url, index);
        return {
          ...info,
          item: chain.evolution_details[0].item,
        }
      }));
      evolutionCases.forEach(data => { if (data.name) cases.push([data]) });

      return cases;
    } else {
      const beforeLevelUp = await getEvolutionData(res.chain.species.url, 1);
      const firstLevelUp = await getEvolutionData(evolutionChain[0].species.url, 2);
      const lastLevelUp = await getEvolutionData(evolutionChain[0].evolves_to[0].species.url, 3);
      const evolutionInfo = [beforeLevelUp, firstLevelUp, lastLevelUp].filter(info => info.name);
      return [evolutionInfo];
    }

  }, [getEvolutionData]);

  function getPokemonForm(pokemonName: string) {
    let label;
    const rapid = pokemonName.includes('rapid-strike'); // 연격의 태세
    const single = pokemonName.includes('single-strike'); // 일격의 태세
    const large = pokemonName.includes('large');
    const average = pokemonName.includes('average');
    const superSize = pokemonName.includes('super');
    const small = pokemonName.includes('small');
    const percentage = pokemonName.includes('50') || pokemonName.includes('10');
    const complete = pokemonName.includes('complete');

    if (rapid) label = '(연격의 태세)';
    if (single) label = '(일격의 태세)';
    if (large) label = '(L)';
    if (small) label = '(S)';
    if (average) label = '(Average)';
    if (superSize) label = '(Super)';
    if (percentage) label = `(${pokemonName.split('-')[1]}%폼)`;
    if (complete) label = `(퍼펙트폼)`;

    return label;
  }

  const getFullName = useCallback((nameKr: string) => {
    const pokemonName = props.data.detail.name;
    const isMega = pokemonName.includes('mega');
    const nameArr = pokemonName.split('-');
    
    if (isMega) {
      if (nameArr.length > 2) {
        const megaKeywordIdx = nameArr.indexOf('mega');
        return `메가${nameKr}-${nameArr[megaKeywordIdx + 1].toUpperCase()}`;
      } else {
        return `메가${nameKr}`;
      }
    }
    
    const form = getPokemonForm(pokemonName);
    return form ? `${nameKr} ${form}` : nameKr;
  }, [props.data]);


  const customData = useCallback(async (detailData:PokemonDetailApiRes, speciesData: PokemonSpeciesApiRes) => {
    if (!speciesData || !detailData) return;
    
    const nameKr = getFullName(speciesData.names.filter(name => name.language.name === 'ko')[0].name);
    const pokemonDesc = speciesData.flavor_text_entries.filter(text => text.language.name === 'ko');
    const evolutionChain = await getEvolutionChain(speciesData.evolution_chain.url);
  
    const abilitiesKr = await Promise.all(detailData.abilities.map(async (ability) => {
      const abilityDetail: AbilityApiRes = await fetch(ability.ability.url).then(data => data.json());
      const result = abilityDetail.flavor_text_entries.filter(effect => effect.language.name === 'ko');
      return {
        text: result[0].flavor_text,
        name: abilityDetail.names.filter(name => name.language.name === 'ko')[0],
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
      nameKr: nameKr, 
      names: speciesData.names,
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
      genera: speciesData.genera.filter(genera => genera.language.name === 'ko'),
      generation: speciesData.generation,
      has_gender_differences: speciesData.has_gender_differences,
      is_legendary: speciesData.is_legendary,
      stats: stats
    };

    setLoading(false);
    setData(result);
    paintGraphBar(result);

  }, [getEvolutionChain, paintGraphBar, getFullName]);





  useEffect(() => {
    customData(props.data.detail, props.data.species);
  },[customData, props.data]);

  return (
    <>
      {!data ? <Loader text={'정보를 불러오는 중입니다...'} /> :
        <div className={detailStyle.detail}>
          <div className={detailStyle.container}>
            <ImageSection images={data.images} pokemonIdx={pokemonIdx} pokemonName={data.nameKr} desc={data.desc}/>
        
            <section className={detailStyle["pokemon-info-section"]}>
              {/* 기본정보 */}
              <DefaultInfo image={data.images.front_default} pokemonName={data.nameKr} pokemonIdx={pokemonIdx} types={data.types} generation={data.generation}/>

              {/* 세부정보 */}
              <DetailInfo genera={data.genera[0].genus} height={data.height} weight={data.weight} />

              {/* 특성 */}
              <AbilityInfo abilities={data.abilitiesKr}/>

              {/* 진화 */}
              <EvolutionInfo evolution={data.evloution_chain} />

              {/* 종족치 */}
              <div className={` ${detailStyle.section}`}>
                <p className={detailStyle["section-title"]}>종족치</p>

                <div className={detailStyle.rate}>
                  {data?.stats.map((stat: PokemonStat, index: number) => {
                    return (
                      <div className={detailStyle['graph-section']} key={`stat-${index}`}>
                        <p className={detailStyle['graph-label']}>{ stat.label }</p>
                        <div className={ detailStyle.graph }>
                          <div ref={el => (barRef.current[index] = el)} className={`${detailStyle['graph-bar']} ${detailStyle[`${stat.stat.name}-bar`]}`}></div>
                        </div>
                        <p>{ stat.base_stat }</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
          <div className={detailStyle["btn-section"]}>
            <Link href="/">
              <button className={detailStyle.btn}>목록으로</button>
            </Link>
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
  const isMega = forms.filter(form => form?.includes('mega')).length > 0;
  const isGmax = forms.filter(form => form?.includes('gmax')).length > 0;
  const hasDifferVersion = forms.filter(form => form?.includes('mega')).length > 1;

  // 포켓몬 정보
  const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(res => res.json());
  const species = await fetch(detail.species.url).then(res => res.json());


  return {
    props: { data: {detail, species, isMega, isGmax, hasDifferVersion} }
  }
}

export default Detail;