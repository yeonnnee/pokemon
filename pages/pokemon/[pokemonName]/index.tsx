import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import detailStyle from '../../../styles/detail.module.scss';
import { PokemonDetail } from "../types";

const Detail = () => {
  const router = useRouter();
  const pokemonName = router.query.pokemonName;
  const [pokemonIdx, setPokemonIdx] = useState<string>('000');
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

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await res.json();
    setPokemonIdx(getThreeDigitsIdx(data.order));
    setData(data)
    console.log('res', data);
  },[pokemonName]);



  useEffect(()=>{
    getDetailData();
  },[getDetailData]);

  return (
    <div className={detailStyle.detail}>
      <div>
        {
          data ? <Image width={400} height={400} src={data.sprites.other["official-artwork"].front_default || ''} alt={data.name}/> : <span>No Image</span>
        }
      </div>

      <div>
        <span>No.{pokemonIdx}</span>
        <div>{data?.name}</div>
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