import { useEffect, useState } from "react";

function usePokemonIdx(pokemonOrder: number) {
  const [pokemonIdx, setPokemonIdx] = useState<string>('');
  
  useEffect(() => {
    if (pokemonOrder < 0) {
      return setPokemonIdx('-');
    }

    if (pokemonOrder < 10) {
      setPokemonIdx(`00${pokemonOrder}`);
    } else if (pokemonOrder > 9 && pokemonOrder < 1000) {
      setPokemonIdx(`0${pokemonOrder}`);
    } else {
      setPokemonIdx(pokemonOrder.toString());
    }
  }, [pokemonOrder]);
  return pokemonIdx;
}

export default usePokemonIdx;