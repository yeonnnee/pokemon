import detailStyle from '../../../styles/detail.module.scss';
import labelStyle from '../../../styles/label.module.scss'

interface InfoContentsProps {
  title: string,
  text: string[],
  label?: string[]
}

const InfoContens = (props: InfoContentsProps) => {
  const { title, text, label } = props;

  function getClassName(index: number) {
    if (!label) return;
    return labelStyle[`${label[index]}`];
  }

  return(
    <li>
      <p className={detailStyle['category-title']}> {title} </p>
      { 
        label ? 
        <div className={detailStyle['info-text-area']}>
          { text.length > 1 ? text.map((content, index) => { return (<p key={`text-${index}`} className={`${detailStyle.label}  ${getClassName(index)}`}>{content}</p>) }) : <p className={`${detailStyle.label} ${getClassName(0)}`}> { text } </p> }
        </div>
        :
        <div className={detailStyle['info-text-area']}>
          { text.map((content, index) => { return text ? <p key={`text-${index}`}>{content}</p> : <p>-</p> }) }
        </div>
      }

    </li>

  )
}

export default InfoContens;