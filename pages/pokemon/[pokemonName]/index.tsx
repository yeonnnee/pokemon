import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../../types/detail";
import { PokemonSpeciesApiRes } from "../../../types/speices";
import { AbilityApiRes } from "../../../types/ability";
import ImageCard from "./ImageCard";
import usePokemonIdx from "../../../hooks/usePokemonIdx";


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
        {
          data ? <Image priority width={400} height={400} src={data.images.other["official-artwork"].front_default || ''} alt={data.name}/> : <span>No Image</span>
        }
        <div className={detailStyle.pic}>
        {/* <ImageCard width={100} height={100} src={data?.images.back_shiny} alt={data?.name}/>
          <ImageCard width={100} height={100} src={data?.images.back_default} alt={data?.name}/> */}
          <ImageCard width={100} height={100} src={data?.images.front_default} alt={data?.name}/>
          <ImageCard width={100} height={100} src={data?.images.front_shiny} alt={data?.name}/>

          <ImageCard width={100} height={100} src={data?.images.other.home.front_default} alt={data?.name}/>
          <ImageCard width={100} height={100} src={data?.images.other.home.front_shiny} alt={data?.name} />

        </div>

      </section>

      <section className={detailStyle["pokemon-info-section"]}>
        <span className={detailStyle.order}>No.{pokemonIdx}</span>
        <div className={detailStyle.name}>
          <span>{data?.nameKr}</span>
        </div>

        {/* 특징 */}
        <div className={`${detailStyle.desc} ${detailStyle.section}`}>
          {/* <p className={detailStyle.category}>특징</p> */}
          <ul className={detailStyle["version-tab"]}>
            {data?.desc.map((desc, index) => <li key={index} onClick={()=>setSelectedVersion(index)} className={selectedVersion === index ? `${detailStyle["selected-tab"]}` : ''}>{desc.version.name.toUpperCase() }</li>)}
          </ul>

          <p className={detailStyle["desc-text"]}>{data?.desc[selectedVersion].flavor_text}</p>
        </div>

        {/* RATE */}
        <div className={`${detailStyle.rate} ${detailStyle.section}`}>
          <p className={detailStyle.category}>STAT</p>

          {data?.stats.map((stat: PokemonStat, index: number) => {
            return (
              <div className={detailStyle['graph-section']} key={index}>
                <p>{ stat.label }</p>
                <div className={ detailStyle.graph }>
                  <div ref={el => (barRef.current[index] = el)} className={`${detailStyle['graph-bar']} ${detailStyle[`${stat.stat.name}-bar`]}`}></div>
                </div>
                <p>{ stat.base_stat }</p>
              </div>
            )
          })}
        </div>

        {/* Info */}
        <ul className={`${detailStyle.info} ${detailStyle.section}`}>
          <li>
            <p className={detailStyle.category}>타입</p>
            <div className={detailStyle.type}>
            {
              data?.types.map((type, index) => {
                return <p key={index}>{type.type.name}</p>
              })
            }
            </div>

          </li>

          <li>
            <p className={detailStyle.category}>신장</p>
            <p>{data?.height}m</p>
          </li>
          
          
          <li>
            <p className={detailStyle.category}>체중</p>
            <p>{data?.weight} kg</p>
          </li>

          <li>
            <p className={detailStyle.category}>세대</p>
            <p>{data?.generation.name}</p>
          </li>

          
          <li>
            <p className={detailStyle.category}>분류</p>
            <p>{data?.genera[0].genus}</p>
          </li>

          <li>
            <p className={detailStyle.category}>특성</p>
            {data?.abilitiesKr.map((ability, index) => {
              return (<p key={index}>{ ability.name.name}</p>)
            })}
          </li>
        </ul>
      </section>
      {/* <div>
        <button>목록으로</button>
      </div> */}
    </div>
  )
}


export default Detail;