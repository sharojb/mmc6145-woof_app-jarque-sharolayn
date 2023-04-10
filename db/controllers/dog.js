import User from '../models/user'
import { normalizeId, dbConnect } from './util'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.favoriteDogs.map(dog => normalizeId(dog))
}

export async function getByGoogleId(userId, dogId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  const dog = user.favoriteDogs.find(dog => dog.googleId === dogId)
  if (dog) return normalizeId(dog)
  return null
}

export async function add(userId, dog) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteDogs: dog } },
    { new: true }
  )
  if (!user) return null
  const addedDog = user.favoriteDogs.find(bk => bk.googleId === dog.googleId)
  return normalizeId(addedDog)
}

export async function remove(userId, dogId) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteDogs: {_id: dogId } } },
    { new: true }
  )
  if (!user) return null
  return true
}