import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import DogList from "../components/dogList";
import Header from '../components/header'
import * as actions from '../context/dog/actions'
import styles from "../styles/Home.module.css";
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useDogContext } from "../context/dog";


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);



// export default function Example() {
//   const [data, setData] = useState

//   useEffect(()=> {
//     axios.get('https://api.api-ninjas.com/v1/dogs?name=pug', 
//     {
//       headers: {
//         'X-Api-Key': 'dGvRn6HL3d6O9+vlFGGVew==PnDY1BrdHYQ22BAj'
//       }
//     }).then(response => {
//       setData(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   }, [])
// }

export default function Home(props) {
  const [{dogSearchResults}, dispatch] = useDogContext()
  const [query, setQuery] = useState("")
  const [fetching, setFetching] = useState(false)
  const [previousQuery, setPreviousQuery] = useState()
  const inputRef = useRef()
  const inputDivRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault()
    if (fetching || !query.trim() || query === previousQuery) return
    setPreviousQuery(query)
    setFetching(true)
    const response = await axios.get('https://api.api-ninjas.com/v1/dogs?name=beagle', 
    {
      headers: {
        'X-Api-Key': 'eBmzvUB1ezkQjt+wEc9wQQ==BFHrx76kZPLO2Hdx'
      }
    })
    if (response.status !== 200) return
    // const data = await res.json()
    console.log(response.data)
    const data = response.data
    dispatch({
      action: actions.SEARCH_DOGS,
      payload: data
        ?.map((dog) => ({
          id: dog.name,
          ...dog
        }))
    })
    setFetching(false)
  }

  return (
    <>
      <Head>
        <title>Woof Home</title>
        <meta name="description" content="Welcome to Woof!" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      <main className={styles.homepage}>
      <h1>Woof</h1>
  <p>Where you sniff, search and love dogs.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="dog-search">Search by name, energy, and/or keywords:</label>
          <div ref={inputDivRef}>
            <input
              ref={inputRef}
              type="text"
              name="dog-search"
              id="dog-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}/>
            <button type="submit">Submit</button>
          </div>
        </form>
        {
          fetching
          ? <Loading />
          : dogSearchResults?.length
          ? <DogList dogs={dogSearchResults}/>
          : <NoResults
          {...{inputRef, inputDivRef, previousQuery}}
          clearSearch={() => setQuery("")}/>
        }
      </main>
    </>
  )
}

function Loading() {
  return <span className={styles.loading}>Still sniffing</span>
}

function NoResults({ inputDivRef, inputRef, previousQuery, clearSearch }) {
  function handleLetsSearchClick() {
    inputRef.current.focus()
    if (previousQuery) clearSearch()
    if (inputDivRef.current.classList.contains(styles.starBounce)) return
    inputDivRef.current.classList.add(styles.starBounce)
    inputDivRef.current.onanimationend = function () {
      inputDivRef.current.classList.remove(styles.starBounce)
    }
  }
  return (
    <div className={styles.noResults}>
      <p><strong>{previousQuery ? `No Dogs found for "${previousQuery}"` : "Nothing to sniff yet"}</strong></p>
      <button onClick={handleLetsSearchClick}>
        {
          previousQuery
          ? `Sniff again?`
          : `Let's find a dog!`
        }
      </button>
    </div>
  )
}