import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import styles from "./style.module.css";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.header}>
        <Link href="/">Home</Link>
      <div className={styles.links}>
      {props.isLoggedIn ? (
        <>
          <Link href="/favorites">Favorites</Link>
          <a href="#" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
      </div>
    </header>
  );
}

