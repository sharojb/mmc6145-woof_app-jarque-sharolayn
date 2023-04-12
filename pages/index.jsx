import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import styles from "../styles/Home.module.css";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);



// export default function Example() {
//   const [data, setData] = useState

//   useEffect(()=> {
//     axios.get('https://api.api-ninjas.com/v1/dogs?name=pug', 
//     {
//       headers: {
//         'X-Api-Key': 'dGvRn6HL3d6O9+vlFGGVew==PnDY1BrdHYQ22BAj'
//       }
//     }).then(response => {
//       setData(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   }, [])
// }

export default function Home(props) {
  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('https://api.api-ninjas.com/v1/dogs?name=beagle', 
    {
      headers: {
        'X-Api-Key': 'eBmzvUB1ezkQjt+wEc9wQQ==BFHrx76kZPLO2Hdx'
      }
    }).then(response => {
      console.log(response)
      setData(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [])

  return (
    <>
      <Head>
        <title>Woof Home</title>
        <meta name="description" content="Welcome to Woof!" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.homepage}>
        <h1>Welcome to Woof</h1>
        <p>Woof is the app for sniffing, researching, previewing, and smile for dogs.</p>
    <div>
      {data.map(item => (
        <div key='hey'>
          <h2>{item.name}</h2>
          <img src={item.image_link}></img>
        </div>
      ))}
      </div>
      </main>

    </>
  );
}
