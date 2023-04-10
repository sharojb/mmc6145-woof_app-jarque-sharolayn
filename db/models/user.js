import { Schema, model, models } from 'mongoose'
import dogSchema from './dog'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20
  },
  favoriteDogs: [dogSchema]
})

// hashes the password before it's stored in mongo
UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default models.User || model('User', UserSchema)