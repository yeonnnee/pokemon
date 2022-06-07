import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../../types/detail";
import { PokemonSpeciesApiRes } from "../../../types/speices";
import { AbilityApiRes } from "../../../types/ability";
import ImageCard from "./ImageCard";
import usePokemonIdx from "../../../hooks/usePokemonIdx";
import DetailInfoList from "./DetailInfoList";
import { EvolutionApiRes } from "../../../types/evolution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";



const Detail = () => {
  const router = useRouter();
  const [pokemonName, setPokemonName] = useState<string | string[] | undefined>(router.query.pokemonName);
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
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
    const first = await getEvolutionData(evolution.chain.species.url, 1);
    const firstEvolution = await getEvolutionData(evolution.chain.evolves_to[0].species.url, 2);
    const lastEvolution = await getEvolutionData(evolution.chain.evolves_to[0].evolves_to[0].species.url, 3);

    return [first, firstEvolution, lastEvolution];
  }, [getEvolutionData]);


  const customData = useCallback(async (detailData:PokemonDetailApiRes, speciesData: PokemonSpeciesApiRes) => {
    if (!speciesData || !detailData) return;
    
    const nameKr = speciesData.names.filter(name => name.language.name === 'ko')[0];
    const pokemonDesc = speciesData.flavor_text_entries.filter(text => text.language.name === 'ko');
    const evolutionChain = await getEvolutionChain(speciesData.evolution_chain.url);
    const abilitiesKr = await Promise.all(detailData.abilities.map(async (ability) => {
      const abilityDetail: AbilityApiRes = await fetch(ability.ability.url).then(data => data.json());
      const result = abilityDetail.flavor_text_entries.filter(effect => effect.language.name === 'ko');
      return {
        text: result,
        name: abilityDetail.names.filter(name => name.language.name === 'ko')[0]
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
      nameKr: nameKr.name, 
      names: speciesData.names,
      desc: pokemonDesc,
      order: detailData.order,
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

  }, [getEvolutionChain, paintGraphBar]);


  const fetchData = useCallback(async () => {
    if (!pokemonName) return;

    const detailData = await getDetailData(pokemonName);
    const speciesData = await getSpeciesData(pokemonName);
    customData(detailData, speciesData);

  }, [getDetailData, getSpeciesData, pokemonName,customData]);


  useEffect(()=>{
    setPokemonName(router.query.pokemonName);
    fetchData();
  },[fetchData, router.query.pokemonName]);

  return (
    <div className={detailStyle.detail}>
      <section className={detailStyle["image-section"]}>
        <div className={detailStyle.profile}>
          <span className={detailStyle.order}>No.{pokemonIdx}</span>
          <div className={detailStyle.name}>
            <span>{data?.nameKr}</span>
          </div>
          <div className={detailStyle["profile-image"]}>
            {
              data ? <Image priority width={400} height={400} src={data.images.other["official-artwork"].front_default || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
        </div>


        <div className={detailStyle.evolution}>
          <p className={detailStyle["section-title"]}>진화</p>
          <ul className={detailStyle["evolution-image"]}>
            {
              data? data.evloution_chain.map((chain) => {
                return (
                  <li key={`evolve-${chain.id}`}>
                    <ImageCard width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} nameKr={chain.nameKr}/>
                    <FontAwesomeIcon icon={faChevronRight} className={ chain.id === 3 ? detailStyle.hidden : ''}/>
                  </li>
                )
              }) : null
            }
          </ul>
        </div>

      </section>

      
      <section className={detailStyle["pokemon-info-section"]}>
        {/* 기본정보 */}
        <div className={detailStyle['default-info']}>
          <p className={detailStyle['section-title']}>기본 정보</p>
          <ul className={detailStyle.section}>
            <li>
              <ImageCard width={80} height={80} src={data?.images.front_default} alt={data?.name} />
            </li>
            <DetailInfoList title={'도감번호'} text={ [pokemonIdx] }/>
            <DetailInfoList title={'이름'} text={ [data?.nameKr || '-'] }/>
            <DetailInfoList title={'타입'} text={ data?.types.map((type) => type.type.name) || ['-'] }/>
            <DetailInfoList title={'세대'} text={ [data?.generation.name || '-'] }/>
          </ul>
        </div>

        {/* 세부정보 */}
        <div className={detailStyle['detail-info']}>
          <p className={detailStyle['section-title']}>세부 정보</p>
          <ul className={detailStyle.section}>
            <DetailInfoList title={'분류'} text={ [data?.genera[0].genus || '-'] }/>
            <DetailInfoList title={'신장'} text={ data ? [`${data.height}m`] : ['-'] }/>
            <DetailInfoList title={'체중'} text={ data ? [`${data.weight}kg`] : ['-'] }/>
            <DetailInfoList title={'특성'} text={ data?.abilitiesKr.map((ability) => ability.name.name) || ['-'] }/>
          </ul>
        </div>

        {/* 특징 */}
        <div className={`${detailStyle.desc} ${detailStyle.section}`}>
          <ul className={detailStyle["version-tab"]}>
            {data?.desc.map((desc, index) => <li key={`version-${index}`} onClick={()=>setSelectedVersion(index)} className={selectedVersion === index ? `${detailStyle["selected-tab"]}` : ''}>{desc.version.name.toUpperCase() }</li>)}
          </ul>
          <p className={detailStyle["desc-text"]}>{data?.desc[selectedVersion].flavor_text}</p>
        </div>

        {/* STAT */}
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

        <div className={detailStyle["btn-section"]}>
          <Link href="/pokemon">
            <button className={detailStyle.btn}>목록으로</button>
          </Link>
        </div>
      </section>

    </div>
  )
}


export default Detail;