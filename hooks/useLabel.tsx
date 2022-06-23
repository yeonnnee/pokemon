import { useEffect, useState } from "react";
import { gmaxLabel } from "../translate/text";

function useLabel(pokemonName: string, lang: string, pokemonIdx: string) {
  const [label, setLabel] = useState('');
  
  useEffect(() => {
    const gmaxText = gmaxLabel.filter(text => text.language == lang)[0]?.text;
    const label = pokemonName.includes('gmax') ? `${gmaxText}` : `No.${pokemonIdx}`;
    setLabel(label);

  }, [lang, pokemonName, pokemonIdx]);
  return label;
}

export default useLabel;