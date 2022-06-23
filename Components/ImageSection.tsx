import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useLabel from '../hooks/useLabel';
import detailStyle from '../styles/detail.module.scss';
import { PokemonSprites } from '../types/detail';
import { FlavorTextEntry } from '../types/speices';
import PokemonDesc from './PokemonDesc';

interface ImageSectionProps {
  pokemonIdx: string,
  pokemonName: string,
  images: PokemonSprites,
  desc: FlavorTextEntry[],
  sectionTitle: string,
  lang:string
}

const ImageSection = (props: ImageSectionProps) => {
  const router = useRouter();
  const { pokemonIdx, pokemonName, images, desc, sectionTitle, lang } = props;
  const queryPokemonNm = router.query.pokemonName as string;
  const label = useLabel(queryPokemonNm, lang, pokemonIdx);

  function goToMain() {
    router.push(`/?lang=${lang}`);
  }

  return (
    <section className={detailStyle["image-section"]}>
      {/* 프로필 이미지 */}
      <div className={detailStyle["back-btn"]}>
        <button className={detailStyle.btn} onClick={goToMain}>
          <FontAwesomeIcon icon={faArrowLeft} className={detailStyle["back-btn-icon"] } />
          {lang === 'ko' ? '목록으로' : 'Go To Main'}
        </button>
      </div>
      <div className={detailStyle.profile}>
        <span className={detailStyle.order}>{ label }</span>
        <div className={detailStyle.name}>
          <span>{pokemonName}</span>
        </div>
      </div>

      <div className={detailStyle["profile-image"]}>
          <Image priority width={500} height={500} src={ images.other["official-artwork"].front_default || images.front_default} alt={pokemonName}/>
        </div>

      {/* 특징 */}
      <PokemonDesc desc={desc} sectionTitle={ sectionTitle} />
      
    </section>
  )
}

export default ImageSection;