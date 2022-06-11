import Image from 'next/image';
import detailStyle from '../styles/detail.module.scss';
import { PokemonSprites } from '../types/detail';
import { FlavorTextEntry } from '../types/speices';
import PokemonDesc from './PokemonDesc';

interface ImageSectionProps {
  pokemonIdx: string,
  pokemonName: string,
  images: PokemonSprites,
  desc: FlavorTextEntry[]
}

const ImageSection = (props: ImageSectionProps) => {
  const { pokemonIdx, pokemonName, images, desc } = props;

  return (
    <section className={detailStyle["image-section"]}>
      {/* 프로필 이미지 */}
      <div className={detailStyle.profile}>
        <span className={detailStyle.order}>No.{pokemonIdx}</span>
        <div className={detailStyle.name}>
          <span>{pokemonName}</span>
        </div>
        <div className={detailStyle["profile-image"]}>
          <Image priority width={400} height={400} src={ images.other["official-artwork"].front_default || ''} alt={pokemonName}/>
        </div>
      </div>

      {/* 특징 */}
      <PokemonDesc desc={desc} />
      
    </section>
  )
}

export default ImageSection;