

import LoaderStyle from "../../styles/loading.module.scss";

interface LoaderProps {
  text: string
}

const Loader = ( props: LoaderProps) => {
  const { text } = props;

  return (
    <div className={LoaderStyle.loading}>
      <p >{ text }</p>
    </div>
  )
}

export default Loader;