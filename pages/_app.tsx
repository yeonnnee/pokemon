import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import Head from 'next/head';
import Nav from '../components/common/Nav';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pokedex</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  )

}

export default MyApp
