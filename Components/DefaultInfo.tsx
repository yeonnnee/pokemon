import detailStyle from '../styles/detail.module.scss';
import { ResourceForPokemon } from '../types/pokemons';
import InfoContents from './InfoContents';
import ImageCard from './ImageCard';
import { PokemonType } from '../types/detail';
import useTypeTranslate from '../hooks/useTypeTranslate';
import { categoryName } from '../translate/text';


interface DetailInfoProps {
  image: string,
  pokemonName: string,
  pokemonIdx: string,
  types: PokemonType[],
  sectionTitle: string,
  lang:string
}

const DefaultInfo = (detailInfo: DetailInfoProps) => {
  const { image, pokemonName, pokemonIdx, types, sectionTitle, lang } = detailInfo;
  const typeNm = useTypeTranslate(types, lang);



  return(
    <div className={detailStyle['default-info']}>
      <p className={detailStyle['section-title']}>{sectionTitle}</p>
      <ul className={detailStyle.section}>
        <li>
          <ImageCard lang={lang} width={80} height={80} src={image} alt={pokemonName} />
        </li>
        <InfoContents title={lang === 'ko' ? '도감번호' : 'No'} text={ [pokemonIdx] }/>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'name')[0].text} text={ [pokemonName] }/>
        <InfoContents title={categoryName.filter(category => category.language === lang && category.category === 'type')[0].text} text={ typeNm || []} label={types.map((type) => type.type.name) || [] }/>
      </ul>
    </div>
  )
}

export default DefaultInfo;