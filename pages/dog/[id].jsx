import Head from 'next/head'
import { useRouter } from "next/router"
import { useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import { useDogContext } from "../../context/dog"
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Dog.module.css'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: "100%",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
      const dog = await db.dog.getDogId(req.session.user.id, params.id)
      if (dog)
        props.dog = dog
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Dog(props) {
  const router = useRouter()
  const dogId = router.query.id
  const { isLoggedIn } = props
  const [{dogSearchResults}] = useDogContext()

  let isFavoriteDog = false
  let dog
  if (props.dog) {
    dog = props.dog
    isFavoriteDog = true
  } else
  dog = dogSearchResults.find(dog => dog.id === dogId)

  useEffect(() => {
    if (!props.dog && !dog)
      router.push('/')
  }, [props.dog, dogSearchResults, dog, router])

  async function addToFavorites() {
    const res = await fetch("/api/dog", {
      method: "POST",
      body: JSON.stringify(dog)
  })
  if (res.status === 200) router.replace(router.asPath)
  }
  async function removeFromFavorites() {
    const res = await fetch("/api/dog", {
      method: "DELETE",
      body: JSON.stringify(dog)
    })
    if (res.status === 200) router.replace(router.asPath)
  }

  return (
    <>
      <Head>
        <title>Woof</title>
        <meta name="description" content="Sniffing a dog on Woof" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header isLoggedIn={isLoggedIn} />
      {
        dog &&
        <main>
          <DogInfo {...dog}/>
          {/* <div className={styles.controls}>
            {
              !isLoggedIn
              ? <>
                  <p>Want to add this dog to your favorites?</p>
                  <Link href="/login" className="button">Login</Link>
                </>
              : isFavoriteDog
              ? <button onClick={removeFromFavorites}>
                  Remove from Favorites
                </button>
              : <button onClick={addToFavorites}>
                  Add to Favorites
                </button>
            }

            <a href="#" onClick={() => router.back()}>
              Return
            </a>
          </div> */}
        </main>
      }
    </>
  )
}

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
    <>
      <div className={styles.titleGroup}>
        <div>
          <h1>{name}</h1>
        </div>
        
          {/* <img src={image_link
            ? image_link
            : "https://via.placeholder.com/128x190?text="} alt={name} /> */}
          
      </div>
      
      <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
            <p>Energy</p>
            <BorderLinearProgress variant="determinate" value={(energy/5)*100} />
            <p>Payfulness</p>
            <BorderLinearProgress variant="determinate" value={(playfulness/5)*100} />
            <p>Protectiveness</p>
            <BorderLinearProgress variant="determinate" value={(protectiveness/5)*100} />
            <p>Trainability</p>
            <BorderLinearProgress variant="determinate" value={(trainability/5)*100} />
            <p>Shedding</p>
            <BorderLinearProgress variant="determinate" value={(shedding/5)*100} />
      </div>
    
    </>
  )
}