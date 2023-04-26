import { DogProvider } from '../context/dog'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <DogProvider>
      <div >
        <Component {...pageProps} />
      </div>
      </DogProvider>
  )
}

export default MyApp
