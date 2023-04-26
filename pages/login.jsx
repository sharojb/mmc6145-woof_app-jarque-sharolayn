import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

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

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim())
      return setError('Must include username and password')
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) return router.back();
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Head>
        <title>Woof Login</title>
        <meta name="description" content="Woof's Login Page" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1>
          Woof! Log in below:
        </h1>

        <form
          className={[styles.card, styles.form].join(" ")}
          onSubmit={handleLogin}
        >
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <button>Login</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/signup">
          <p>Sign up</p>
        </Link>
      </main>
    </>
  );
}
