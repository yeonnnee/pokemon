import detailStyle from '../styles/detail.module.scss';
import { ResourceForPokemon } from '../types/pokemons';
import InfoContents from './InfoContents';
import ImageCard from './ImageCard';
import { PokemonType } from '../types/detail';


interface DetailInfoProps {
  image: string,
  pokemonName: string,
  pokemonIdx: string,
  types: PokemonType[],
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

  function convertTypeName(name: string) {
    switch (name) {
      case 'normal': return '노말';
      case 'fighting': return '격투';
      case 'flying': return '비행';
      case 'poison': return '독';
      case 'ground': return '땅';
      case 'rock': return '바위';
      case 'bug': return '벌레';
      case 'ghost': return '고스트';
      case 'steel': return '강철';
      case 'fire': return '불꽃';
      case 'water': return '물';
      case 'grass': return '풀';
      case 'electric': return '전기';
      case 'psychic': return '에스퍼';
      case 'ice': return '얼음';
      case 'dragon': return '드레곤';
      case 'dark': return '악';
      case 'fairy': return '페어리';
      case 'unknown': return 'unKnown';
      case 'shadow': return '다크 ';
      default: return '';
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
        <InfoContents title={'타입'} text={types.map((type) => convertTypeName(type.type.name)) || []} label={types.map((type) => type.type.name) || [] }/>
        <InfoContents title={'세대'} text={ [convertGenerationText(generation.name)] }/>
      </ul>
    </div>
  )
}

export default DefaultInfo;