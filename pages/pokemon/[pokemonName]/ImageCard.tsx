import Image from 'next/image';

interface ImageCardPorps {
  width: number,
  height: number,
  src: string | undefined | null,
  alt: string | undefined | null,

}


const ImageCard = (props: ImageCardPorps) => {
  const { width, height, src, alt } = props;
  return(
    <div>
      {
        src ? <Image priority width={width} height={height} src={src} alt={alt ? alt : 'image'}/> : <span> No Image </span>
      }
    </div>
  )
}

export default ImageCard;