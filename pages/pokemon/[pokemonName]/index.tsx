import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes, PokemonStat } from "../../types/detail";
import { PokemonSpeciesApiRes } from "../../types/speices";


const Detail = () => {
  const router = useRouter();
  const [pokemonName, setPokemonName] = useState<string | string[] | undefined>(router.query.pokemonName);
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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

  const paintGraphBar = useCallback((result:PokemonDetail | null) => {
    if (!result || loading) return;
    console.log('paint', result)
    const happines = result.happiness;
    const hpRate = result.stats.find(stat => stat.stat.name === 'hp')?.base_stat;
    const attackRate = result.stats.find(stat => stat.stat.name === 'attack')?.base_stat;
    const defenseRate = result.stats.find(stat => stat.stat.name === 'defense')?.base_stat;
    const spAttackRate = result.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat;
    const spDefenseRate = result.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat;
    const speedRate = result.stats.find(stat => stat.stat.name === 'speed')?.base_stat;

    console.log(happinessBarRef)

    if (!happinessBarRef.current) return;
    happinessBarRef.current.style.width = `${ (happines && happines > 100) ? 100 : happines}%`;

    console.log(happinessBarRef)
    if (!spAttackBarRef.current) return;
    spAttackBarRef.current.style.width = `${(spAttackRate && spAttackRate > 100) ? 100 : spAttackRate}%`;
    console.log(2)
    
    if (!spDefenseBarRef.current) return;
    spDefenseBarRef.current.style.width = `${(spDefenseRate && spDefenseRate > 100) ? 100 : spDefenseRate}%`;
    console.log(3)

    if (!hpBarRef.current) return;
    hpBarRef.current.style.width = `${(hpRate && hpRate > 100) ? 100 : hpRate}%`;

    if (!attackBarRef.current) return;
    attackBarRef.current.style.width = `${(attackRate && attackRate > 100) ? 100 : attackRate}%`;

    if (!defenseBarRef.current) return;
    defenseBarRef.current.style.width = `${(defenseRate && defenseRate > 100) ? 100 : defenseRate}%`;

    if (!speedBarRef.current) return;
    speedBarRef.current.style.width = `${(speedRate && speedRate > 100) ? 100 : speedRate}%`;
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

  const getStatRef = (name: string) => {
    switch (name) { 
      case 'hp' : return hpBarRef;
      case 'attack': return attackBarRef;
      case 'defense': return defenseBarRef;
      case 'special-attack': return spAttackBarRef;
      case 'special-defense': return spDefenseBarRef;
      case 'speed': return speedBarRef;
      default: return happinessBarRef;
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
          ref: getStatRef(stat.stat.name),
        }
      })
    };

    result.stats.push({url:'', base_stat: result.happiness, stat:{name: 'happiness', url:''}, label: 'Happiness', ref: getStatRef('happiness'),})
    console.log(result);
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
          <div>
            {
              data ? <Image priority width={100} height={100} src={data.images.back_default || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image priority width={100} height={100} src={data.images.back_shiny || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image priority width={100} height={100} src={data.images.front_default || ''} alt={data.name}/> : <span>No Image</span>
            }
          </div>
          <div>
            {
              data ? <Image priority width={100} height={100} src={data.images.front_shiny || ''} alt={data.name}/> : <span>No Image</span>
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