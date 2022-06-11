import detailStyle from '../styles/detail.module.scss';
import { AbilityDetail } from '../types/ability';


interface AbilityProps {
  abilities: AbilityDetail[]
}

const AbilityInfo = (props:AbilityProps) => {
  const { abilities } = props;

  return(
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>특성</p>
      <ul className={`${detailStyle.section} ${detailStyle.ability}`}>
        {
          abilities.map((ability, index) =>
          <li key={index}>
            <div className={`${detailStyle["ability-name"]}`}>
              {ability.isHidden ? <span>*</span> : null} {ability.name.name}
              <div className={detailStyle["tool-tip"]}>숨겨진 특성</div>  
            </div>
            <div className={`${detailStyle["ability-desc"]}`}>{ability.text}</div>
          </li>)
        }
      </ul>
    </div>
  )
}

export default AbilityInfo;