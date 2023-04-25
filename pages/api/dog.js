import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'
import { ADD_DOG } from "../../context/dog/actions";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if(!req.session.user) {
      return res.status(401).end()
    }
    switch(req.method) {
    case 'POST':
      console.log("POST")
      return addDog(req,res)
    case 'DELETE':
      console.log("DELETE")
      return removeDog(req,res)
    }
    return res.status(404).end()
  },
  sessionOptions
)

const addDog = async(req,res)=>{
  const dog = await JSON.parse(req.body)
  console.log(dog)
  try {
    const addedDog = await db.dog.add(req.session.user.id, dog)
    if(addedDog) {
      res.status(200).end()
    } else {
      req.session.destroy()
      res.status(401).end()
    }
  } catch(err) {
    console.log(err)
    res.status(400).json({error:err.message})
  }
}

const removeDog = async(req,res)=>{
  const dog = await JSON.parse(req.body)
  console.log(dog)
  try {
    const removedDog = await db.dog.remove(req.session.user.id, dog.name)
    if(removedDog) {
      res.status(200).end()
    } else {
      req.session.destroy()
      res.status(401).end()
    }
  } catch(err) {
    console.log(err)
    res.status(400).json({error:err.message})
  }
}