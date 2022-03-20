import Head from 'next/head'
import { Header } from '../components/Header'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>managn</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default App
