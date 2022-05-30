import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Image src="/main_logo.png" alt="Main logo" width={350} height={150} />
      <Link href="/main">
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
