import detailStyle from '../../../styles/detail.module.scss';
import { ResourceForPokemon } from '../../../types/pokemons';
import { CustomPokemonType } from '../../../types/pokemonTypes';
import InfoContents from './InfoContents';
import ImageCard from './ImageCard';


interface DetailInfoProps {
  image: string,
  pokemonName: string,
  pokemonIdx: string,
  types: CustomPokemonType[],
  generation: ResourceForPokemon
}

const DefaultInfo = (detailInfo: DetailInfoProps) => {
  const { generation, image, pokemonName, pokemonIdx, types } = detailInfo;

  const convertGenerationText = (generation: string) => {
    switch (generation) {
      case 'generation-i' : return '1세대 포켓몬';
      case 'generation-ii' : return '2세대 포켓몬';
      case 'generation-iii' : return '3세대 포켓몬';
      case 'generation-iv' : return '4세대 포켓몬';
      case 'generation-v' : return '5세대 포켓몬';
      case 'generation-vi' : return '6세대 포켓몬';
      case 'generation-vii': return '7세대 포켓몬' ;
      default: return generation;
    }
  }

  return(
    <div className={detailStyle['default-info']}>
      <p className={detailStyle['section-title']}>기본 정보</p>
      <ul className={detailStyle.section}>
        <li>
          <ImageCard width={80} height={80} src={image} alt={pokemonName} />
        </li>
        <InfoContents title={'도감번호'} text={ [pokemonIdx] }/>
        <InfoContents title={'이름'} text={ [pokemonName] }/>
        <InfoContents title={'타입'} text={types.map((type) => type.nameKr) || []} label={types.map((type) => type.name) || [] }/>
        <InfoContents title={'세대'} text={ [convertGenerationText(generation.name)] }/>
      </ul>
    </div>
  )
}

export default DefaultInfo;