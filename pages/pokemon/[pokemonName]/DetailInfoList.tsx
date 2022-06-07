import detailStyle from '../../../styles/detail.module.scss';

interface DetailInfoProps {
  title: string,
  text: string[],
}

const DetailInfoList = (detailInfo: DetailInfoProps) => {
  const { title, text } = detailInfo;

  return(
    <li>
      <p className={ detailStyle['category-title'] }> { title } </p>
      <div className={detailStyle['info-text-area']}>
        { text.length > 1 ? text.map((content, index) => { return (<p key={`text-${index}`}>{content}</p>) }) : <p> { text } </p> }
      </div>
    </li>

  )
}

export default DetailInfoList;