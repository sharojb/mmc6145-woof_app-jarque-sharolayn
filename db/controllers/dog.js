import User from '../models/user'
import { normalizeId, dbConnect } from './util'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.favoriteDogs.map(dog => normalizeId(dog))
}

export async function getByDogName(userId, dogName) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  const dog = user.favoriteDogs.find(dg => dg.name === dogName)
  console.log(dog)
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
  console.log(user)
  if (!user) return null
  const addedDog = user.favoriteDogs.find(dg => dg.name === dog.name)
  console.log(addedDog)
  return normalizeId(addedDog)
}

export async function remove(userId, dogName) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteDogs: {name: dogName } } },
    { new: true }
  )
  if (!user) return null
  return true
}