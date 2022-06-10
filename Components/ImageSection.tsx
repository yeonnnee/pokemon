import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import detailStyle from '../styles/detail.module.scss';
import { EvolutionData, PokemonSprites } from '../types/detail';
import ImageCard from './ImageCard';

interface ImageSectionProps {
  pokemonIdx: string,
  pokemonName: string,
  images: PokemonSprites,
  evolution: {
    evolution: EvolutionData[],
    isMega: boolean,
    isGmax: boolean
  }
}

const ImageSection = (props: ImageSectionProps) => {
  const { pokemonIdx, pokemonName, images, evolution } = props;

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

      {/* 진화 */}
      <div className={detailStyle.evolution}>
        <p className={detailStyle["section-title"]}>진화</p>
        <ul className={detailStyle["evolution-image"]}>
          {
            evolution.evolution.map((chain) => {
              return chain.id ?
                <li key={`evolve-${chain.id}`}>
                  <ImageCard width={100} height={100} src={chain.image} alt={chain.name} name={chain.name} nameKr={chain.nameKr}/>
                  <FontAwesomeIcon icon={faChevronRight} className={ chain.id === 3 || !evolution.evolution[chain.id] ? detailStyle.hidden : ''}/>
                </li> : null
            })
          }
        </ul>
      </div>
    </section>
  )
}

export default ImageSection;