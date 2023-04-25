import { useRouter } from 'next/router'

export default function useFavorites() {
    const router = useRouter()
    async function addToFavorites(dog) {
        const res = await fetch("/api/dog", {
          method: "POST",
          body: JSON.stringify(dog)
      })
      if (res.status === 200) router.replace(router.asPath)
      }
      async function removeFromFavorites(dog) {
        const res = await fetch("/api/dog", {
          method: "DELETE",
          body: JSON.stringify(dog)
        })
        if (res.status === 200) router.replace(router.asPath)
      }

    return {
        addToFavorites,
        removeFromFavorites
    }
}