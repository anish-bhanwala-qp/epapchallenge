import { useContext } from "react";
import { UserContext } from "../auth/UserProvider";

export const Authenticated = (props) => {
  const user = useContext(UserContext);
  if (user == null) {
    return null;
  }

  if (!user.admin) {
    return <h1>Access denied</h1>;
  }

  return <>{props.children}</>;
};
