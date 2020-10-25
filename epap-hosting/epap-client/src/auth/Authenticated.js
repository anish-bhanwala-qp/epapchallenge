import { useContext } from "react";
import { UserContext } from "../auth/UserProvider";

export const Authenticated = (props) => {
  const user = useContext(UserContext);
  if (user == null) {
    return null;
  }  

  return <>{props.children}</>;
};
