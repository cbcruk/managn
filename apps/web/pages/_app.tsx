import Head from 'next/head'
import { Header } from '../components/Header'
import I18n from '../components/I18n'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <I18n lngDict={pageProps.lngDict} locale={pageProps.locale}>
      <Head>
        <title>managn</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="grow">
          <Component {...pageProps} />
        </div>
      </div>
    </I18n>
  )
}

export default App
