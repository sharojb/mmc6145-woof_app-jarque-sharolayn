import styles from './style.module.css'
import { RiHeart2Line, RiHeartFill } from "react-icons/ri";
import { useDogContext } from "../../context/dog";
import * as actions from "../../context/dog/actions"
import { useRouter } from 'next/router';

export default function DogPreview(props) {
  const [{dogSearchResults},dispatch] = useDogContext()
  const {
    name, image_link, isFavorite
  } = props
  const router = useRouter()

  console.log(isFavorite)


  const handleFavorite = async () => {
    let res = await fetch("/api/dog", {
      method: props.isFavorite ? "DELETE" : "POST",
      body: JSON.stringify(props)
    })
    if (res.status !== 200) return
    const data = await res.json()
    dispatch({
      action: props.isFavorite ? actions.REMOVE_DOG : actions.ADD_DOG,
      payload: data
    })
    router.replace(router.asPath)
  }
  
  return (
    <div className={styles.preview}>
      <img
        src={image_link ? image_link : ""}
        alt={name} />
      <div>
        <p><strong>{name}</strong></p>
        
      </div>
    </div>
  )
}