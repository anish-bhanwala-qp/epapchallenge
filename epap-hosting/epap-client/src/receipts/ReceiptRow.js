import React from "react";
import styles from "./ReceiptRow.module.css";

export const ReceiptRow = (props) => {
  const data = props.doc.data();

  return (
    <ul className={styles.container}>
      <li>
        <label>Store</label> {data.storeName}
      </li>
      {props.storeIconUrl && (
        <li>
          <img
            src={props.storeIconUrl}
            alt={data.storeName}
            width="50"
            height="auto"
          ></img>
        </li>
      )}
      <li>
        <label>Receipt no.</label> {data.number}
      </li>
      <li>
        <label>Date</label> {data.date.toDate().toLocaleDateString()}
      </li>
      <li>
        <label>Amount</label> {data.amount}
      </li>
    </ul>
  );
};
