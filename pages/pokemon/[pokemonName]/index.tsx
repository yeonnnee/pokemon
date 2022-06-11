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

const Detail = () => {
  const router = useRouter();
  const [pokemonName, setPokemonName] = useState<string | string[] | undefined>(router.query.pokemonName);
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonIdx = usePokemonIdx(data?.order || 0);

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

  const getSpeciesData = useCallback(async (pokemonName:string | string[]) => {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const species: PokemonSpeciesApiRes = await speciesRes.json();
    return species;
  }, []);

  const getDetailData = useCallback(async(pokemonName:string | string[]) => {
    const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const detail:PokemonDetailApiRes = await detailRes.json();
    return detail;
  },[]);

  

  const getEvolutionData = useCallback(async (url: string, index: number) => {
    const result = await fetch(url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: index,
        name: data.name,
        nameKr: data.names.filter(name => name.language.name === 'ko')[0].name,
        image: detail.sprites.front_default
      }
    });
    return result;
  }, []);


  const getEvolutionChain = useCallback(async (url:string) => {
    const evolution: EvolutionApiRes = await fetch(url).then(data => data.json());
    const firstEvolution = evolution.chain.evolves_to[0];
    const finalEvolution = evolution.chain.evolves_to[0]?.evolves_to[0];

    const initialData = {
      id: null,
      name: null,
      nameKr: null,
      image: null,
    };

    const beforeEvolution = await getEvolutionData(evolution.chain.species.url, 1);
    const firstLevelUp = firstEvolution ? await getEvolutionData(firstEvolution.species.url, 2) : initialData;
    const lastLevelUp = finalEvolution ? await getEvolutionData(finalEvolution.species.url, 3) : initialData;
    const isMega = lastLevelUp.name ? await getDetailData(`${lastLevelUp.name}-mega`).then(res => true).catch(err => false) : false;
    const isGmax = lastLevelUp.name ? await getDetailData(`${lastLevelUp.name}-gmax`).then(res => true).catch(err => false) : false;

    const evolutionInfo = [beforeEvolution, firstLevelUp, lastLevelUp].filter(info=>info.id);

    return { evolution: evolutionInfo, isMega: isMega, isGmax: isGmax };
  }, [getEvolutionData,getDetailData]);




  function convertTypeName(name: string) {
    switch (name) {
      case 'normal': return '노말';
      case 'fighting': return '격투';
      case 'flying': return '비행';
      case 'poison': return '독';
      case 'ground': return '땅';
      case 'rock': return '바위';
      case 'bug': return '벌레';
      case 'ghost': return '고스트';
      case 'steel': return '강철';
      case 'fire': return '불꽃';
      case 'water': return '물';
      case 'grass': return '풀';
      case 'electric': return '전기';
      case 'psychic': return '에스퍼';
      case 'ice': return '얼음';
      case 'dragon': return '드레곤';
      case 'dark': return '악';
      case 'fairy': return '페어리';
      case 'unknown': return 'unKnown';
      case 'shadow': return '다크 ';
      default: return '';
    }
  }

  const getFullName = useCallback((nameKr: string) => {
    const isGmax = pokemonName?.includes('gmax');
    const isMega = pokemonName?.includes('mega');

    if (isGmax) return `${nameKr} (거다이맥스)`;
    if (isMega) return `메가${nameKr}`;
    
    return nameKr;
  }, [pokemonName]);


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

    const hapiness = {
      url: '',
      base_stat: speciesData.base_happiness,
      stat: { name: 'happiness', url: '' },
      label: 'Happiness'
    };

    stats.push(hapiness);


    const result = {
      name: speciesData.name,
      nameKr: nameKr, 
      names: speciesData.names,
      desc: pokemonDesc,
      order: detailData.order,
      weight: detailData.weight,
      height: detailData.height,
      types: detailData.types.map(type => {return {...type.type, nameKr: convertTypeName(type.type.name)}}),
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


  const fetchData = useCallback(async () => {
    if (!pokemonName) return;

    const detailData = await getDetailData(pokemonName);
    const speciesData = await getSpeciesData(detailData.species.name);
    customData(detailData, speciesData);

  }, [getDetailData, getSpeciesData, pokemonName,customData]);


  useEffect(() => {
    setPokemonName(router.query.pokemonName);
    fetchData();
  },[fetchData, router.query.pokemonName]);

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
              <DetailInfo genera={data.genera[0].genus} height={data.height} weight={data.weight} form={data.evloution_chain}/>

              {/* 특성 */}
              <AbilityInfo abilities={data.abilitiesKr}/>

              {/* 진화 */}
              <EvolutionInfo evolution={data.evloution_chain.evolution} />

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


export default Detail;