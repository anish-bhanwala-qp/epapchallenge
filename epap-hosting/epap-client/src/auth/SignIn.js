import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import { UserContext } from "./UserProvider";

const provider = new firebase.auth.GoogleAuthProvider();

const SignIn = () => {
  const [error, setError] = useState("");
  const user = useContext(UserContext);
  if (user !== null) {
    return null;
  }

  const onSignIn = () => {
    // Reset error
    setError("");

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // // The signed-in user info.
        // const user = result.user;
        // // onLogin(user, token);
        console.log("Login success!");
      })
      .catch(function (error) {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;

        setError(`Oops error occured: ${errorMessage}`);
      });
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <div className="error">{error}</div>}
      <button onClick={onSignIn}>Sign in with Google</button>
    </div>
  );
};
export default SignIn;
