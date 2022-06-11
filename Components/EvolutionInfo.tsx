import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import detailStyle from '../styles/detail.module.scss';
import { EvolutionData } from '../types/detail';
import ImageCard from './ImageCard';

interface EvolutionInfoProps {
  evolution: EvolutionData[],
}

const EvolutionInfo = (props : EvolutionInfoProps) => {
  const { evolution } = props;

  return (
    <div className={detailStyle.evolution}>
      <p className={detailStyle["section-title"]}>진화</p>
      <ul className={detailStyle["evolution-image"]}>
        {
          evolution.length === 1 ?
            <li>진화 정보가 없습니다.</li>
            :
          evolution.map((chain) => {
            return chain.id ?
              <React.Fragment key={`evolve-${chain.id}`}>
                <li >
                  <ImageCard width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} nameKr={chain.nameKr}/>
                </li>
                {
                  evolution[chain.id] ? <li><FontAwesomeIcon icon={faChevronRight} /></li> : null
                }
              </React.Fragment>
            : null
          })
        }
      </ul>
    </div>
  )
}

export default EvolutionInfo;