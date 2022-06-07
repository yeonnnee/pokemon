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

  const getDetailData = useCallback(async() => {
    if(!pokemonName) return;
    const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const detail:PokemonDetailApiRes = await detailRes.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const species:PokemonSpeciesApiRes = await speciesRes.json();

    const nameKr = species.names.filter(name => name.language.name === 'ko')[0];
    const desc = species.flavor_text_entries.filter(text => text.language.name === 'ko');

    const abilitiesKr = await Promise.all(detail.abilities.map(async (ability) => {
      const abilityDetail: AbilityApiRes = await fetch(ability.ability.url).then(data => data.json());
      const result = abilityDetail.flavor_text_entries.filter(effect => effect.language.name === 'ko');
      return {
        text: result,
        name: abilityDetail.names.filter(name => name.language.name === 'ko')[0]
      };
    }));

    const evolution: EvolutionApiRes = await fetch(species.evolution_chain.url).then(data => data.json());
    const first = await fetch(evolution.chain.species.url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: 1,
        name: data.name,
        nameKr: data.names.filter(name => name.language.name === 'ko')[0].name,
        image: detail.sprites.front_default
      }

    });
    const firstEvolve = await fetch(evolution.chain.evolves_to[0].species.url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: 2,
        name: data.name,
        nameKr: data.names.filter(name => name.language.name === 'ko')[0].name,
        image: detail.sprites.front_default
      }

    });
    const lastEvolve = await fetch(evolution.chain.evolves_to[0].evolves_to[0].species.url).then(async (res) => {
      const data: PokemonSpeciesApiRes = await res.json();
      const detail: PokemonDetailApiRes = await fetch(data.varieties[0].pokemon.url).then(res => res.json());

      return {
        id: 3,
        name: data.name,
        nameKr: data.names.filter(name => name.language.name === 'ko')[0].name,
        image: detail.sprites.front_default
      }

    });

    const evolutionData = [first, firstEvolve, lastEvolve];


    console.log('first', evolutionData);

      
    console.log('detail', detail);
    console.log('species', species);
    console.log('abilitiesKr', abilitiesKr);

    const result = {
      name: species.name,
      nameKr: nameKr.name, 
      names: species.names,
      desc: desc,
      order: detail.order,
      weight: detail.weight,
      height: detail.height,
      types: detail.types,
      images: detail.sprites,
      // abilities: detail.abilities,
      evloution_chain: evolutionData,
      abilitiesKr: abilitiesKr,
      happiness: species.base_happiness,
      capture_rate: species.capture_rate,
      growth_rate: species.growth_rate,
      flavor_text_entries: species.flavor_text_entries,
      genera: species.genera.filter(genera => genera.language.name === 'ko'),
      generation: species.generation,
      has_gender_differences: species.has_gender_differences,
      is_legendary: species.is_legendary,
      stats: detail.stats.map(stat => {
        return {
          ...stat,
          label: convertStatName(stat.stat.name),
        }
      })
    };

    result.stats.push({url:'', base_stat: result.happiness, stat:{name: 'happiness', url:''}, label: 'Happiness'})

    setLoading(false);
    setData(result);
    paintGraphBar(result);
  },[paintGraphBar,pokemonName]);



  useEffect(()=>{
    setPokemonName(router.query.pokemonName);
    getDetailData();
  },[getDetailData, router.query.pokemonName]);

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
          <p>진화</p>
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
          <p>기본 정보</p>
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
          <p>세부 정보</p>
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
        <div className={`${detailStyle.rate} ${detailStyle.section}`}>
          <p className={detailStyle.category}>STAT</p>

          {data?.stats.map((stat: PokemonStat, index: number) => {
            return (
              <div className={detailStyle['graph-section']} key={`stat-${index}`}>
                <p>{ stat.label }</p>
                <div className={ detailStyle.graph }>
                  <div ref={el => (barRef.current[index] = el)} className={`${detailStyle['graph-bar']} ${detailStyle[`${stat.stat.name}-bar`]}`}></div>
                </div>
                <p>{ stat.base_stat }</p>
              </div>
            )
          })}
        </div>
      </section>
      {/* <div>
        <button>목록으로</button>
      </div> */}
    </div>
  )
}


export default Detail;