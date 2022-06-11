import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          evolution.map((chain) => {
            return chain.id ?
              <li key={`evolve-${chain.id}`}>
                <ImageCard width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} nameKr={chain.nameKr}/>
                <FontAwesomeIcon icon={faChevronRight} className={ chain.id === 3 || !evolution[chain.id] ? detailStyle.hidden : ''}/>
              </li> : null
          })
        }
      </ul>
    </div>
  )
}

export default EvolutionInfo;