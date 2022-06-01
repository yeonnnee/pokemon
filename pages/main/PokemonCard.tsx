import { NextPage } from "next";
import Image from "next/image";
import { PokemonDetail, ResourceForPokemon } from "./types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as star} from '@fortawesome/free-solid-svg-icons'
import cardStyle from '../../styles/pokemon-card.module.scss'


const PokemonCard = (pokemon:PokemonDetail, key: number) => {
  const pokemonIdx = getThreeDigitsIdx(pokemon.order);
  const types = pokemon.types.map(type => type.type.name);
  // const ratingStarArr = Array.from({length: 5}, (v,i) => i+1);

  function getThreeDigitsIdx(pokemonOrder: number) {
    if(pokemonOrder < 10) {
      return `00${pokemonOrder}`;
    } else if(pokemonOrder > 9) {
      return `0${pokemonOrder}`;
    } else {
      return pokemonOrder.toString();
    }
  }
  
  function getClassName(index: number) {
    return cardStyle[`${types[index]}`];
  }

  console.log('card',pokemon)
  return(
    <li className={cardStyle.card}>
      <div className={cardStyle.info}>No.{pokemonIdx}</div>
      <div className={cardStyle.info}>{pokemon.name.toUpperCase()}</div>
      <div className={cardStyle.type}>
        {
          types.map((type, index) => {
            return <span key={index} className={getClassName(index)}>{type}</span>
          })
        }
      </div>
      <Image width={150} height={150} src={pokemon.sprites.other["official-artwork"].front_default || ''} alt={pokemon.name}/>

      {/* <ul className={cardStyle.category}>
        <li>
          <span>Type</span>
          {
            pokemon.types.map((type, index) => {
              return <div key={index} className={cardStyle.type}>{type.type.name}</div>
            })
          }
        </li>
        <li>
          <span>Height</span>
          <span>{pokemon.height}m</span>
        </li>
        <li>
          <span>Weight</span>
          <span>{pokemon.weight}kg</span>
        </li>

      </ul> */}
      {/* <div className={cardStyle.rarity}>
        {ratingStarArr.map(num => {
          const isColoredStar = num <= pokemon.held_items[0]?.version_details[0].rarity ? true : false;
          return <FontAwesomeIcon icon={star} className={isColoredStar ? cardStyle.rating : cardStyle.emptyStar} key={num}/>
        })}
        
      </div> */}

    </li>
  )
}

export default PokemonCard;