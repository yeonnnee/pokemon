import Image from 'next/image';
import Link from 'next/link';
import detailStyle from '../styles/detail.module.scss';

interface ImageCardPorps {
  width: number,
  height: number,
  src: string | undefined | null,
  alt: string | undefined | null,
  name?: string | null,
  nameKr?: string | null
}


const ImageCard = (props: ImageCardPorps) => {
  const { width, height, src, alt, name, nameKr } = props;
  return (
    <Link href={`/pokemon/${name}`}>
      <div className={detailStyle.pic}>
        {
          src ? <Image priority width={width} height={height} src={src} alt={alt ? alt : 'image'}/> : <span> No Image </span>
        }
        <div className={detailStyle["tool-tip"]}>{ nameKr }</div>
        
      </div>
    </Link>

  )
}

export default ImageCard;