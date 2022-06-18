import Link from 'next/link';
import detailStyle from '../styles/detail.module.scss';
import { EvolutionData } from '../types/detail';
import InfoContents from './InfoContents';

interface DetailInfoProps {
  genera: string,
  height: number,
  weight: number,
}

const DetailInfo = (detailInfo: DetailInfoProps) => {
  const { genera, height, weight } = detailInfo;


  return(
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>세부 정보</p>
      <ul className={detailStyle.section}>
        <InfoContents title={'분류'} text={ [genera] }/>
        <InfoContents title={'신장'} text={ [`${height}m`] }/>
        <InfoContents title={'체중'} text={ [`${weight}kg`] }/>

        <li>
          <p className={detailStyle['category-title']}> 형태 </p>
            <div className={detailStyle['info-text-area']}>
  
            </div>
        </li>
      </ul>
    </div>
  )
}

export default DetailInfo;