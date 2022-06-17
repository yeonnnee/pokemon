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
        <span className={detailStyle.order}>{ pokemonIdx !== '-' ? `No.${pokemonIdx}` : '다이맥스'}</span>
        <div className={detailStyle.name}>
          <span>{pokemonName}</span>
        </div>
      </div>

      <div className={detailStyle["profile-image"]}>
          <Image priority width={500} height={500} src={ images.other["official-artwork"].front_default || images.front_default} alt={pokemonName}/>
        </div>

      {/* 특징 */}
      <PokemonDesc desc={desc} />
      
    </section>
  )
}

export default ImageSection;