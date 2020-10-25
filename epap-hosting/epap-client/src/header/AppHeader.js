import { useContext } from "react";
import { UserContext } from "../auth/UserProvider";
import styles from "./AppHeader.module.css";
import firebase from "firebase/app";

export const AppHeader = () => {
  const user = useContext(UserContext);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("Sign-out successful.");
      })
      .catch(function (error) {
        console.log("An error happened.");
      });
  };
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.logo}>
        epAp <small>Client</small>
      </h1>
      <div className={styles.username}>
        {user && (
          <a href="/#" onClick={handleLogout}>
            (Logout)
          </a>
        )}
      </div>
      <em> ({user && user.email}) </em>
    </header>
  );
};
