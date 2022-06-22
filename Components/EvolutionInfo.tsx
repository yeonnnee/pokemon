import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import detailStyle from '../styles/detail.module.scss';
import { EvolutionData } from '../types/detail';
import ImageCard from './ImageCard';

interface EvolutionInfoProps {
  evolution: EvolutionData[][],
  sectionTitle: string,
  lang: string
}

const EvolutionInfo = (props : EvolutionInfoProps) => {
  const { evolution, sectionTitle, lang } = props;

  console.log('eve', evolution);

  return (
    <div className={detailStyle.evolution}>
      <p className={detailStyle["section-title"]}>{sectionTitle}</p>
      {
        evolution.map((evolutionCase, index) => {
          return (
            <ul key={index} className={detailStyle["evolution-image"]}>
              {
                // evolution.length === 1 ?
                //   <li>진화 정보가 없습니다.</li>
                //   :
                evolutionCase.map((chain) => {
                  return chain.id ?
                    <React.Fragment key={`evolve-${chain.id}`}>
                      <li >
                        <ImageCard lang={lang} width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} translatedNm={chain.translatedNm}/>
                      </li>
                      {
                        evolution[chain.id] ? <li><FontAwesomeIcon icon={faChevronRight} /></li> : null
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