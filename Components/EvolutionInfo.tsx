import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import detailStyle from '../styles/detail.module.scss';
import { noEvolutionInfo } from '../translate/text';
import { EvolutionData } from '../types/detail';
import ImageCard from './ImageCard';

interface EvolutionInfoProps {
  evolution: EvolutionData[][],
  sectionTitle: string,
  lang: string
}

const EvolutionInfo = (props : EvolutionInfoProps) => {
  const { evolution, sectionTitle, lang } = props;
  const noEvolutionInfoText = noEvolutionInfo.filter(text => text.language == lang)[0].text;

  return (
    <div className={detailStyle.evolution}>
      <p className={detailStyle["section-title"]}>{sectionTitle}</p>
      {
        evolution.map((evolutionCase, index) => {
          return (
            <ul key={index} className={detailStyle["evolution-image"]}>
              {
                evolutionCase.length === 1 ?
                  <li>{noEvolutionInfoText}</li>
                  :
                evolutionCase.map((chain) => {
                  return chain.id ?
                    <React.Fragment key={`evolve-${chain.id}`}>
                      <li >
                        <ImageCard lang={lang} width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} translatedNm={chain.translatedNm}/>
                      </li>
                      {
                        evolutionCase[chain.id] ?
                          <li>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </li>
                          : null
                      }


                    </React.Fragment>
                  : null
                })
              }
            </ul>
          )
        })
      }
      
    </div>
  )
}

export default EvolutionInfo;