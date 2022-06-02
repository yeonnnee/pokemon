import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const Detail = () => {
  const router = useRouter();
  const pokemonName = router.query.pokemonName;

  const getDetailData = useCallback(async() => {
    if(!pokemonName) return;

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const result = await res.json();
    console.log('res', result);
  },[pokemonName]);



  useEffect(()=>{
    getDetailData();
  },[getDetailData]);

  return (<p>{pokemonName}</p>)
}


export default Detail;