import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../types/detail";
import { PokemonSpeciesApiRes } from "../../types/speices";


const Detail = () => {
  const router = useRouter();
  const pokemonName = router.query.pokemonName;
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  const happinessBarRef = useRef<HTMLDivElement | null>(null);
  const hpBarRef = useRef<HTMLDivElement | null>(null);
  const attackBarRef = useRef<HTMLDivElement | null>(null);
  const defenseBarRef = useRef<HTMLDivElement | null>(null);
  const spAttackBarRef = useRef<HTMLDivElement | null>(null);
  const spDefenseBarRef = useRef<HTMLDivElement | null>(null);
  const speedBarRef = useRef<HTMLDivElement | null>(null);



  function getThreeDigitsIdx(pokemonOrder: number) {
    if(pokemonOrder < 10) {
      return `00${pokemonOrder}`;
    } else if(pokemonOrder > 9) {
      return `0${pokemonOrder}`;
    } else {
      return pokemonOrder.toString();
    }
  }

  function converGrowthToPercentage(growthRate:string) {
    switch (growthRate) {
      case 'slow': return 10;
      case 'medium': return 50;
      case 'medium-slow': return 32;
      case 'fase': return 100;
      case 'slow-then-very-fast': return 90;
      case 'fast-then-very-slow': return 20;
      default: return 0;
    }
  }

  const paintGraphBar = useCallback((result: PokemonDetail) => {
    const growthRate = result.growth_rate.name;
    const convertedGrowthRate = converGrowthToPercentage(growthRate);
    const happines = result.happiness > 100 ? 100 : result.happiness;
    const captureRate = result.capture_rate > 100 ? 100 : result.capture_rate;
    const hpRate = result.stats.find(stat => stat.stat.name === 'hp')?.base_stat;
    const attackRate = result.stats.find(stat => stat.stat.name === 'attack')?.base_stat;
    const defenseRate = result.stats.find(stat => stat.stat.name === 'defense')?.base_stat;
    const spAttackRate = result.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat;
    const spDefenseRate = result.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat;
    const speedRate = result.stats.find(stat => stat.stat.name === 'speed')?.base_stat;

    if (!happinessBarRef.current) return;
    happinessBarRef.current.style.width = `${happines}%`;

    if (!spAttackBarRef.current) return;
    spAttackBarRef.current.style.width = `${spAttackRate}%`;
    
    if (!spDefenseBarRef.current) return;
    spDefenseBarRef.current.style.width = `${spDefenseRate}%`;

    if (!hpBarRef.current) return;
    hpBarRef.current.style.width = `${hpRate}%`;

    if (!attackBarRef.current) return;
    attackBarRef.current.style.width = `${attackRate}%`;

    if (!defenseBarRef.current) return;
    defenseBarRef.current.style.width = `${defenseRate}%`;

    
    if (!speedBarRef.current) return;
    speedBarRef.current.style.width = `${defenseRate}%`;
  }, []);

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

  const getStatRef = (name: string) => {
    switch (name) { 
      case 'hp' : return hpBarRef;
      case 'attack': return attackBarRef;
      case 'defense': return defenseBarRef;
      case 'special-attack': return spAttackBarRef;
      case 'special-defense': return spDefenseBarRef;
      case 'speed': return speedBarRef;
      default: return null;
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
    console.log(desc)
    const result = {
      name: species.name,
      nameKr: nameKr.name, 
      names: species.names,
      desc: desc,
      order: getThreeDigitsIdx(detail.order),
      weight: detail.weight,
      height: detail.height,
      types: detail.types,
      images: detail.sprites,
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
          ref: getStatRef(stat.stat.name)
        }
      })
    };
    console.log(result);
    paintGraphBar(result);

    setData(result);
  },[pokemonName, paintGraphBar]);



  useEffect(()=>{
    getDetailData();
  },[getDetailData]);

  return (
    <div className={detailStyle.detail}>
      <section className={detailStyle["image-section"]}>
        {
          data ? <Image width={400} height={400} src={data.images.other["official-artwork"].front_default || ''} alt={data.name}/> : <span>No Image</span>
        }
        <div className={detailStyle.pic}>
          <div>
            {
              data ? <Image width={100} height={100} src={data.images.back_default || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image width={100} height={100} src={data.images.back_shiny || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image width={100} height={100} src={data.images.front_default || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image width={100} height={100} src={data.images.front_shiny || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
        </div>

      </section>

      <section className={detailStyle["pokemon-info-section"]}>
        <span className={detailStyle.order}>No.{data?.order}</span>
        <div className={detailStyle.name}>
          <span>{data?.nameKr}</span>
        </div>

        {
              data ? <Image width={100} height={100} src={data.images.other.home.front_default|| ''} alt={data.name}/> : <span>No Image</span>
        }
        
        {
              data ? <Image width={100} height={100} src={data.images.other.home.front_shiny|| ''} alt={data.name}/> : <span>No Image</span>
            }

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
            // if (index > 2) return;
            return (
              <div className={detailStyle['graph-section']} key={index}>
                <p>{ stat.label }</p>
                <div className={ detailStyle.graph }>
                  <div ref={stat.ref} className={`${detailStyle['graph-bar']} ${detailStyle[`${stat.stat.name}-bar`]}`}></div>
                </div>
                <p>{ stat.base_stat }</p>
              </div>
            )
          })}


          <div className={detailStyle['graph-section']}>
            <p>Happiness</p>
            <div className={detailStyle.graph}>
              <div ref={happinessBarRef} className={`${detailStyle['graph-bar']} ${detailStyle['happiness-bar']}`}></div>
            </div>
            <p>{ data?.happiness }</p>
          </div>

          {/* <div className={detailStyle['graph-section']}>
            <p>Capture</p>
            <div className={detailStyle.graph}>
              <div ref={captureBarRef} className={`${detailStyle['graph-bar']} ${detailStyle['capture-bar']}`}></div>
            </div>
            <p>{ data?.capture_rate }</p>
          </div>

          <div className={detailStyle['graph-section']}>
            <p>Growth</p>
            <div className={detailStyle.graph}>
              <div ref={growthBarRef} className={`${detailStyle['graph-bar']} ${detailStyle['growth-bar']}`}></div>
            </div>
            <p>{ data?.growth_rate.name }</p>
          </div> */}
        </div>

        {/* Info */}
        <ul className={`${detailStyle.info} ${detailStyle.section}`}>
          <li>
            <p className={detailStyle.category}>Type</p>
            <div className={detailStyle.type}>
            {
              data?.types.map((type, index) => {
                return <p key={index}>{type.type.name}</p>
              })
            }
            </div>

          </li>


          <li>
            <p className={detailStyle.category}>Height</p>
            <p>{data?.height}m</p>
          </li>
          
          
          <li>
            <p className={detailStyle.category}>Weight</p>
            <p>{data?.weight} kg</p>
          </li>

          <li>
            <p className={detailStyle.category}>Generation</p>
            <p>{data?.generation.name}</p>
          </li>

          
          <li>
            <p className={detailStyle.category}>Category</p>
            <p>{data?.genera[0].genus}</p>
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