import detailStyle from '../../../styles/detail.module.scss';
import { PokemonStat } from '../../../types/detail';


const StatGraph = (stat: PokemonStat, ref: any ) => {

  return(
    <div className={detailStyle['graph-section']}>
      <p>{stat.label}</p>
      <div className={detailStyle.graph}>
        <div ref={stat.ref} className={`${detailStyle['graph-bar']} ${detailStyle[`${stat.stat.name}-bar`]}`}></div>
      </div>
      <p>{ stat.base_stat}</p>
    </div>

  )
}

export default StatGraph;