import type { GetStaticProps, NextPage } from 'next'

const Main: NextPage = (props) => {
  console.log(props);
  return <div>Main</div>
}

// 데이터가 있어야 화면을 그릴 수 있으므로 SSG 방식으로 렌더링
export const getStaticProps: GetStaticProps = async(context) => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = await res.json();
  return{
    props:{data}
  }
}

export default Main;