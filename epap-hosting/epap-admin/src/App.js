import "./firebaseConfig";
import { UserProvider } from "./auth/UserProvider";
import SignIn from "./auth/SignIn";
import { StoreIconUpload } from "./store-icon-upload/StoreIconUpload";
import { AppHeader } from "./header/AppHeader";
import styles from "./App.module.css";
import { Authenticated } from "./auth/Authenticated";
import { Unauthenticated } from "./auth/Unauthenticated";

const App = () => {
  return (
    <UserProvider>
      <AppHeader />
      <main className={styles.content}>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <StoreIconUpload />
        </Authenticated>
      </main>
    </UserProvider>
  );
};

export default App;
