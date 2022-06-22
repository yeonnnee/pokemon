import { useState } from 'react';
import detailStyle from '../styles/detail.module.scss';
import { FlavorTextEntry } from '../types/speices';

interface PokemonDescProps {
  desc: FlavorTextEntry[],
  sectionTitle: string
}

const PokemonDesc = (props: PokemonDescProps) => {
  const { desc, sectionTitle } = props;
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  return (
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>{ sectionTitle }</p>
      <div className={`${detailStyle.desc} ${detailStyle.section}`}>
        <ul className={detailStyle["version-tab"]}>
            {desc.map((text, index) =>
              <li key={`version-${index}`} onClick={() => setSelectedVersion(index)} className={selectedVersion === index ? `${detailStyle["selected-tab"]}` : ''}>
                {text.version.name.toUpperCase()}
              </li>
            )}
        </ul>
        <p className={detailStyle["desc-text"]}>{desc[selectedVersion].flavor_text}</p>
      </div>
    </div>
  )
}

export default PokemonDesc;