import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail, PokemonDetailApiRes } from "../../types/detail";
import { PokemonSpeciesApiRes } from "../../types/speices";


const Detail = () => {
  const router = useRouter();
  const pokemonName = router.query.pokemonName;
  const [data, setData] = useState<PokemonDetail | null>(null);



  function getThreeDigitsIdx(pokemonOrder: number) {
    if(pokemonOrder < 10) {
      return `00${pokemonOrder}`;
    } else if(pokemonOrder > 9) {
      return `0${pokemonOrder}`;
    } else {
      return pokemonOrder.toString();
    }
  }


  const getDetailData = useCallback(async() => {
    if(!pokemonName) return;
    const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const detail:PokemonDetailApiRes = await detailRes.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const species:PokemonSpeciesApiRes = await speciesRes.json();

    const result = {
      name: species.name,
      names: species.names,
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
    setData(result);
  },[pokemonName]);



  useEffect(()=>{
    getDetailData();
  },[getDetailData]);

  return (
    <div className={detailStyle.detail}>
      <div>
        {
          data ? <Image width={400} height={400} src={data.images.other["official-artwork"].front_default || ''} alt={data.name}/> : <span>No Image</span>
        }
      </div>

      <div>
        <span>No.{data?.order}</span>
        <div>{data?.name}</div>

        <div>
          <p>Generation</p>
          <p>{data?.generation.name}</p>
        </div>
        <div>
          <p>Rate</p>

          <div>
          <p>Happiness</p>
        </div>
        <div>
          <p>Capture</p>
        </div>
        <div>
          <p>Growth</p>
        </div>

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
      </div>
    </div>
  )
}


export default Detail;