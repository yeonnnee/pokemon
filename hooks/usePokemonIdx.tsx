import { useEffect, useState } from "react";

function usePokemonIdx(pokemonOrder: number) {
  const [pokemonIdx, setPokemonIdx] = useState<string>('');
  
  useEffect(() => {
    if (pokemonOrder < 0) {
      return setPokemonIdx('-');
    }
    setPokemonIdx(pokemonOrder.toString().padStart(3, '0'));
  }, [pokemonOrder]);
  return pokemonIdx;
}

export default usePokemonIdx;