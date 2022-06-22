import detailStyle from '../styles/detail.module.scss';
import { hiddenText } from '../translate/text';
import { AbilityDetail } from '../types/ability';


interface AbilityProps {
  abilities: AbilityDetail[],
  sectionTitle: string,
  lang: string
}

const AbilityInfo = (props:AbilityProps) => {
  const { abilities, sectionTitle, lang } = props;
  const hiddenAbilityText = hiddenText.filter(hidden => hidden.language === lang)[0].text; // 숨겨진 특성

  return(
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>{ sectionTitle }</p>
      <ul className={`${detailStyle.section} ${detailStyle.ability}`}>
        {
          abilities.map((ability, index) =>
          <li key={index}>
            <div className={`${detailStyle["ability-name"]}`}>
              {ability.isHidden ? <span>*</span> : null} {ability.name.name}
              <div className={detailStyle["tool-tip"]}>{hiddenAbilityText}</div>  
            </div>
            <div className={`${detailStyle["ability-desc"]}`}>{ability.text}</div>
          </li>)
        }
      </ul>
    </div>
  )
}

export default AbilityInfo;