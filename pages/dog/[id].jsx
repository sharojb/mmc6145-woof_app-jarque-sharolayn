import Head from 'next/head'
import { useRouter } from "next/router"
import Link from 'next/link'
import { useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import { useDogContext } from "../../context/dog"
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Dog.module.css'

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
      const dog = await db.dog.getByGoogleId(req.session.user.id, params.id)
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
  dog = dogSearchResults.find(dog => dog.googleId === dogId)

  // No dog from search/context or getServerSideProps/favorites, redirect to Homepage
  useEffect(() => {
    if (!props.dog && !dog)
      router.push('/')
  }, [props.dog, dogSearchResults, dog, router])

  async function addToFavorites() {
    // TODO: use fetch to call POST /api/dog
    // Be sure to pass dog in body (use JSON.stringify)
    // Call router.replace(router.asPath) if you receive a 200 status
    const res = await fetch("/api/dog", {
      method: "POST",
      body: JSON.stringify(dog)
  })
  if (res.status === 200) router.replace(router.asPath)
  }
  async function removeFromFavorites() {
    // TODO: use fetch to call DELETE /api/dog
    // Be sure to pass {id: <dog id>} in body (use JSON.stringify)
    // Call router.replace(router.asPath) if you receive a 200 status
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header isLoggedIn={isLoggedIn} />
      {
        dog &&
        <main>
          <DogInfo isFavorite={isFavoriteDog} {...dog}/>
          <div className={styles.controls}>
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
          </div>
        </main>
      }
    </>
  )
}

function DogInfo({
  title,
  authors,
  thumbnail,
  description,
  isFavorite,
  pageCount,
  categories,
  previewLink
}) {
  return (
    <>
      <div className={styles.titleGroup}>
        <div>
          <h1>{title}{isFavorite && <sup>⭐</sup>}</h1>
          {
            authors && authors.length > 0 &&
            <h2>By: {authors.join(", ").replace(/, ([^,]*)$/, ', and $1')}</h2>
          }
          {
            categories && categories.length > 0 &&
            <h3>Category: {categories.join(", ").replace(/, ([^,]*)$/, ', and $1')}</h3>
          }
        </div>
        <a target="_BLANK"
          href={previewLink}
          className={styles.imgContainer}
          rel="noreferrer">
          <img src={thumbnail
            ? thumbnail
            : "https://via.placeholder.com/128x190?text=NO COVER"} alt={title} />
          <span>Look Inside!</span>
        </a>
      </div>
      <p>Description:<br/>{description}</p>
      <p>Pages: {pageCount}</p>
      <div className={styles.links}>
        <span>Order online:</span>
        <a target="_BLANK"
          href={`https://www.amazon.com/s?k=${title} ${authors ? authors[0] : ""}`}
          rel="noreferrer">
          Amazon
        </a>
        <a target="_BLANK"
          href={`https://www.barnesandnoble.com/s/${title} ${authors ? authors[0] : ""}`}
          rel="noreferrer">
          Barnes & Noble
        </a>
      </div>
    </>
  )
}