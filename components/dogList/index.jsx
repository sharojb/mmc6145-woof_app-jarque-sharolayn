import Link from "next/link"
import DogPreview from "../dogPreview"
import styles from './style.module.css'

export default function DogList({dogs}) {
  return (
    <div className={styles.list}>
      {dogs.map(dog => <Link key={dog.googleId} href={`/dog/${dog.googleId}`} style={{textDecoration: 'none'}}>
        <DogPreview {...dog} />
      </Link>)}
    </div>
  )
}