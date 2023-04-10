// import { Open_Sans } from '@next/font/google'
// import { DogProvider } from '../context/dog'
import '../styles/globals.css'

// const openSans = Open_Sans({
//   weight: ['300', '400', '800'],
//   style: ['normal', 'italic'],
//   subsets: ['latin']
// })

function MyApp({ Component, pageProps }) {
  return (
      <div >
        <Component {...pageProps} />
      </div>
  )
}

export default MyApp
