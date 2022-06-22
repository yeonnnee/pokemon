import Image from 'next/image';
import Link from 'next/link';
import detailStyle from '../styles/detail.module.scss';

interface ImageCardPorps {
  lang: string,
  width: number,
  height: number,
  src: string | undefined | null,
  alt: string | undefined | null,
  name?: string | null,
  translatedNm?: string | null
}


const ImageCard = (props: ImageCardPorps) => {
  const { lang, width, height, src, alt, name, translatedNm } = props;

  return (
    <Link href={`/pokemon/${name}?lang=${lang}`}>
      <div className={detailStyle.pic}>
        {
          src ? <Image priority width={width} height={height} src={src} alt={alt ? alt : 'image'}/> : <span> No Image </span>
        }
        <div className={detailStyle["tool-tip"]}>{ translatedNm ? translatedNm : name }</div>
        
      </div>
    </Link>

  )
}

export default ImageCard;