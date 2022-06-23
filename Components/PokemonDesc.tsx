import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import useOutsideClick from '../hooks/useClickOutside';
import detailStyle from '../styles/detail.module.scss';
import { FlavorTextEntry } from '../types/speices';

interface PokemonDescProps {
  desc: FlavorTextEntry[],
  sectionTitle: string
}

const PokemonDesc = (props: PokemonDescProps) => {
  const { desc, sectionTitle } = props;
  const [selectedVersion, setSelectedVersion] = useState<FlavorTextEntry>(desc[0]);
  const dropdownRef = useRef<HTMLInputElement>(null);

  useOutsideClick(dropdownRef);

  function selectDescVersion(description: FlavorTextEntry) {
    setSelectedVersion(description);

    if (!dropdownRef.current) return;
    dropdownRef.current.checked = false;
  }

  return (
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>{ sectionTitle }</p>
      <div className={`${detailStyle.desc} ${detailStyle.section}`}>
        <input type="checkbox" id="filter" className={detailStyle["drop-down"]} ref={dropdownRef} />
        <label htmlFor="filter" className={detailStyle["selected-version"]}>
          {selectedVersion.version.name.toUpperCase()} <FontAwesomeIcon icon={faAngleDown} className={detailStyle["drop-down-icon"]}/>
        </label>


        <ul className={detailStyle["version-tab"]}>
          {desc.map((text, index) =>
            <li key={`version-${index}`} onClick={()=>selectDescVersion(text)}>
              <input type="checkbox" id={text.version.name}  />
              <label htmlFor={ text.version.name || 'x' } >{text.version.name.toUpperCase()} </label>
            </li>
          )}
        </ul>
 
        <p className={detailStyle["desc-text"]}>{selectedVersion.flavor_text }</p>
      </div>
    </div>
  )
}

export default PokemonDesc;