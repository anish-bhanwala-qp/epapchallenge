import React, { useEffect, useState } from "react";
import { firestoreDb } from "../firebaseConfig";
import styles from "./StoreDropdown.module.css";

export const StoreDropdown = (props) => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "-1") {
      props.handleChange("-1");
    } else {
      props.handleChange(stores.find((s) => s.id === value));
    }
  };

  useEffect(() => {
    firestoreDb
      .collection("stores")
      .get()
      .then(function (querySnapshot) {
        const stores = [];
        querySnapshot.forEach(function (doc) {
          stores.push(doc);
        });

        setStores(stores);
      })
      .catch((er) => {
        setError(er);
      });
  }, []);

  if (error) {
    return <div>{`Error fetching stores: ${error}`}</div>;
  }

  const hasIconUrl = props.value && props.value !== "-1";
  const iconUrl =
    hasIconUrl && stores.find((s) => s.id === props.value).get("iconUrl");

  return (
    <>
      <select value={props.value || "-1"} onChange={handleChange}>
        <option value="-1">--Select--</option>
        {stores.map((store) => {
          return (
            <option key={store.id} value={store.id}>
              {store.get("name")}
            </option>
          );
        })}
      </select>
      <div className={styles.thumbnail}>
        {iconUrl && <img src={iconUrl}></img>}
      </div>
    </>
  );
};
