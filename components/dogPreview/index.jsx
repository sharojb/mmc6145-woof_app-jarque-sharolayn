import styles from './style.module.css'

export default function DogPreview({
  name, image_link
}) {
  return (
    <div className={styles.preview}>
      <img
        src={image_link ? image_link : "https://via.placeholder.com/128x190?text=NO COVER"}
        alt={name} />
      <div>
        <p><strong>{name}</strong></p>
        
      </div>
    </div>
  )
}