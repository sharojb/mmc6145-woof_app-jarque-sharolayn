import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    switch(req.method) {
 
    case 'POST':
      console.log(req.body)
      return res.status( 200).json({
        name: 'Post Doe',
        method: req.method,
        body: req.body
      })
    default:
      return res.status(404).end()
    }

    const user = req.session.user;
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return res.status(404).end()
  },
  sessionOptions
)