import React, { Component, createContext } from "react";
import firebase from "firebase/app";

export const UserContext = createContext({ user: null });
export class UserProvider extends Component {
  state = {
    loading: true,
    user: null,
  };

  unsubscribeOAuthListner;

  componentDidMount = () => {
    this.unsubscribeOAuthListner = firebase
      .auth()
      .onAuthStateChanged((userAuth) => {
        if (userAuth != null) {
          userAuth
            .getIdTokenResult(true)
            .then((idTokenResult) => {
              // Confirm the user is an Admin.
              userAuth.admin = idTokenResult.claims.admin;
              this.setState({
                loading: false,
                user: userAuth,
              });
            })
            .catch((error) => {
              this.setState({ user: null, loading: false });
              console.log(error);
            });
        } else {
          this.setState({ user: null, loading: false });
        }
      });
  };

  componentWillUnmount = () => {
    this.unsubscribeOAuthListner && this.unsubscribeOAuthListner();
    this.unsubscribeOAuthListner = undefined;
  };

  render() {
    const { user, loading } = this.state;

    return (
      <UserContext.Provider value={user}>
        {!loading && this.props.children}
        {loading && "Loading..."}
      </UserContext.Provider>
    );
  }
}
