import Link from "next/link"
import DogPreview from "../dogPreview"
import styles from './style.module.css'

export default function DogList({dogs}) {
  console.log(dogs)
  return (
    <div className={styles.list}>
      {dogs.map(dog => <Link key={dog.id} href={`/dog/${dog.name}`} style={{textDecoration: 'none'}}>
        
          <DogPreview {...dog} />
        
      </Link>)}
    </div>
  )
}