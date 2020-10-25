import "./firebaseConfig";
import { UserProvider } from "./auth/UserProvider";
import SignIn from "./auth/SignIn";
import { AppHeader } from "./header/AppHeader";
import styles from "./App.module.css";
import { Authenticated } from "./auth/Authenticated";
import { Unauthenticated } from "./auth/Unauthenticated";
import { ReceiptList } from "./receipts/ReceiptList";

const App = () => {
  return (
    <UserProvider>
      <AppHeader />
      <main className={styles.content}>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <ReceiptList />
        </Authenticated>
      </main>
    </UserProvider>
  );
};

export default App;
