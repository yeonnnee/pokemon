import Link from 'next/link';
import detailStyle from '../styles/detail.module.scss';
import { categoryName } from '../translate/text';
import { EvolutionData } from '../types/detail';
import InfoContents from './InfoContents';

interface DetailInfoProps {
  genera: string,
  height: number,
  weight: number,
  captureRate: number
  sectionTitle: string,
  lang: string,
}

const DetailInfo = (detailInfo: DetailInfoProps) => {
  const { genera, height, weight, captureRate, sectionTitle, lang } = detailInfo;


  return(
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>{ sectionTitle }</p>
      <ul className={detailStyle.section}>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'category')[0].text} text={ [genera] }/>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'height')[0].text} text={ [`${height}m`] }/>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'weight')[0].text} text={ [`${weight}kg`] }/>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'capture rate')[0].text} text={ [`${captureRate}`] }/>
      </ul>
    </div>
  )
}

export default DetailInfo;