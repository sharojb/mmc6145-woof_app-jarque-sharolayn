import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import DogList from "../components/dogList";
import Header from '../components/header'
import * as actions from '../context/dog/actions'
import styles from "../styles/Home.module.css";
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useDogContext } from "../context/dog";
import db from "../db"
import {find} from "lodash"


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {}
    let favoriteDogs
    if (user) {
      props.favoriteDogs = await db.dog.getAll(user.id)
      props.user = user
      props.isLoggedIn = !!user
    }
    return { 
      props
    };
  },
  sessionOptions
);

export default function Home(props) {
  const [{dogSearchResults}, dispatch] = useDogContext()
  const {favoriteDogs} = props
  const [query, setQuery] = useState("")
  const [fetching, setFetching] = useState(false)
  const [previousQuery, setPreviousQuery] = useState()
  const inputRef = useRef()
  const inputDivRef = useRef()

  useEffect(()=>{
    console.log(dogSearchResults.length)
  }, dogSearchResults)

  async function handleSubmit(e) {
    e.preventDefault()
    if (fetching || !query.trim() || query === previousQuery) return
    setPreviousQuery(query)
    setFetching(true)
    const response = await axios.get(`https://api.api-ninjas.com/v1/dogs?name=${query}`, 
    {
      headers: {
        'X-Api-Key': 'eBmzvUB1ezkQjt+wEc9wQQ==BFHrx76kZPLO2Hdx'
      }
    })
    if (response.status !== 200) return
    // const data = await res.json()
    //console.log(response.data)
    const data = response.data
    dispatch({
      action: actions.SEARCH_DOGS,
      payload: data
        ?.map((dog) => ({
          id: dog.name,
          ...dog
        })) || []
    })
    setFetching(false)
  }

  return (
    <>
      <Head>
        <title>Woof Home</title>
        <meta name="description" content="Welcome to Woof!" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      <main className={styles.homepage}>
      <h1>Woof</h1>
  <p>To sniff and love dogs by breed, energy and/or keywords:</p>
        <form onSubmit={handleSubmit} className={styles.form}>
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
        fetching ? <Loading/> : 
        <Switch test={dogSearchResults?.length || 0}>
          <Case default><DogList dogs={dogSearchResults.map((dog,index)=>{
            return {isFavorite: !!find(favoriteDogs, {name: dog.name}), ...dog}
            //return {isFavorite: index%2===0?true:false, ...dog}
          },[favoriteDogs])}/></Case>
          <Case value={0}>
            <NoResults
              {
                ...{
                    inputRef,
                    inputDivRef,
                    previousQuery
                   }
              }
              clearSearch={() => setQuery("")}/></Case>
        </Switch>
      }
      </main>
    </>
  )
}

const Switch = ({test, children}) => {
  return children.find(child=>child.props.value===test) || children.find(child=>child.props.default)
}

const Case = ({children}) => children

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

  function DogInfo({
    image_link,
    name,
    energy,
    playfulness,
    protectiveness,
    trainability,
    shedding
  }) {
    return (
        <div className={styles.titleGroup}>
          <div>
            <h1>{name}</h1>
          </div>
      
        </div>
        
    )}}
