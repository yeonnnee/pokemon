import Image from "next/image";
import Link from "next/link";
import NavStyle from '../../styles/nav.module.scss'

const Nav = () => {

  return(
    <nav className={NavStyle.nav}>
      <div className={NavStyle.logo} >
        <Link href={`/`}>
          <a>
            <Image src="/main_logo.png" alt="logo" width={150} height={50} />
          </a>
        </Link>
      </div>  
    {/* 
      <ul>
        <li>검색</li>
        <li>카테고리</li>
      </ul> */}
    </nav>
  )
}

export default Nav;