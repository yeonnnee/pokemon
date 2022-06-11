import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from '../styles/Home.module.scss'
import Router from "next/router";

const Home: NextPage = () => {
  const { pathname } = useRouter();

  // useEffect(() => {
  //   if (pathname === "/") {
  //     Router.push("/pokemon");
  //   }
  // });
  return (
    <div className={styles.container}>
      <Image src="/main_logo.png" alt="Main logo" width={350} height={150} />
      <Link href="/pokemon">
        <a>Start</a>
      </Link>
      <div className={styles.bookContainer}>
        <div className={styles.book}>
        <div className={styles.cover}>
        </div>
        <div className={styles.page}>
        </div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
        <div className={`${styles.backCover}`}></div>
        </div>
      </div>
    </div>
  )
}

export default Home
