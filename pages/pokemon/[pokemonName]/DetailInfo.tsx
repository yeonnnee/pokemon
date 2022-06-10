import Link from 'next/link';
import detailStyle from '../../../styles/detail.module.scss';
import { EvolutionData } from '../../../types/detail';
import DetailInfoList from './DetailInfoList';

interface DetailInfoProps {
  genera: string,
  height: number,
  weight: number,
  form: {
    evolution: EvolutionData[],
    isGmax: boolean,
    isMega: boolean
  }
}

const DetailInfo = (detailInfo: DetailInfoProps) => {
  const { genera, height, weight, form } = detailInfo;
  const finalEvolutionName = form.evolution[form.evolution.length - 1].name;

  return(
    <div className={detailStyle['detail-info']}>
      <p className={detailStyle['section-title']}>세부 정보</p>
      <ul className={detailStyle.section}>
        <DetailInfoList title={'분류'} text={ [genera] }/>
        <DetailInfoList title={'신장'} text={ [`${height}m`] }/>
        <DetailInfoList title={'체중'} text={ [`${weight}kg`] }/>

        <li>
          <p className={detailStyle['category-title']}> Form </p>
            <div className={detailStyle['info-text-area']}>
              { form.isGmax ? <Link href={`/pokemon/${finalEvolutionName}-gmax`}><a>다이맥스</a></Link> : null }
              { form.isMega ? <Link href={`/pokemon/${finalEvolutionName}-mega`}><a>메가진화</a></Link> : null }
              { !form.isMega && !form.isGmax ? <p>-</p> : null}
            </div>
        </li>
      </ul>
    </div>
  )
}

export default DetailInfo;