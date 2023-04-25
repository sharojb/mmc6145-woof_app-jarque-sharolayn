import { Schema } from 'mongoose'

const dogSchema = new Schema({
  name: String,
  min_height: Number,
  max_height: Number,
  min_weight: Number,
  max_weight: Number,
  min_life_expectancy: Number,
  max_life_expectancy: Number,
  shedding: Number,
  barking: Number,
  protectiveness: Number,
  trainability: Number,
  image_link: String,
  energy: String,
  previewLink: String,
})

export default dogSchema