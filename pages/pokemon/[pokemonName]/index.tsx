import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes } from "../../types/detail";
import { PokemonSpeciesApiRes } from "../../types/speices";


const Detail = () => {
  const router = useRouter();
  const pokemonName = router.query.pokemonName;
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  const happinessBarRef = useRef<HTMLDivElement | null>(null);
  const growthBarRef = useRef<HTMLDivElement | null>(null);
  const captureBarRef = useRef<HTMLDivElement | null>(null);


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

    if (!happinessBarRef.current) return;
    happinessBarRef.current.style.width = `${result.happiness}%`;

    if (!growthBarRef.current) return;
    growthBarRef.current.style.width = `${convertedGrowthRate}%`;
    
    if (!captureBarRef.current) return;
    captureBarRef.current.style.width = `${result.capture_rate}%`;
  }, []);

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
      genera: species.genera,
      generation: species.generation,
      has_gender_differences: species.has_gender_differences,
      is_legendary: species.is_legendary,
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
      </section>

      <section className={detailStyle["pokemon-info-section"]}>
        <span className={detailStyle.order}>No.{data?.order}</span>
        <div className={detailStyle.name}>{data?.nameKr}</div>

        <div className={detailStyle.desc}>
          <span className={detailStyle.category}>특징</span>
          <ul className={detailStyle["version-tab"]}>
            {data?.desc.map((desc, index) => <li key={index} onClick={()=>setSelectedVersion(index)}>{desc.version.name.toUpperCase() }</li>)}
          </ul>

          <p>{data?.desc[selectedVersion].flavor_text}</p>
        </div>

        <div className={detailStyle.rate}>
          <p className={detailStyle.category}>Rate</p>

          <div className={detailStyle['graph-section']}>
            <p>Happiness</p>
            <div className={detailStyle.graph}>
              <div ref={happinessBarRef} className={`${detailStyle['graph-bar']} ${detailStyle['happiness-bar']}`}></div>
            </div>
            <p>{ data?.happiness }</p>
          </div>

          <div className={detailStyle['graph-section']}>
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
          </div>
        </div>



        <div>
          <p>Generation</p>
          <p>{data?.generation.name}</p>
        </div>

        <div>
          <p>Type</p>
          {
            data?.types.map((type, index) => {
              return <span key={index}>{type.type.name}</span>
            })
          }
        </div>


        <div>
          <p>Height</p>
          <p>{data?.height}m</p>
        </div>
        
        
        <div>
          <p>Weight</p>
          <p>{data?.weight}</p>
        </div>

      </section>
    </div>
  )
}


export default Detail;