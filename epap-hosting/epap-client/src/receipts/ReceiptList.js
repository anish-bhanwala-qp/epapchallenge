import React, { useEffect, useState } from "react";
import { ReceiptRow } from "./ReceiptRow";
import { db } from "../firebaseConfig";

export const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    db.collection("receipts").onSnapshot(
      function (querySnapshot) {
        console.log("Query snapshot called");
        const rs = [];
        querySnapshot.forEach(function (doc) {
          rs.push(doc);
        });

        setReceipts(rs);
      },
      (e) => {
        setError(e.message);
      }
    );
  }, []);

  if (error) {
    return <div>{`Error fetching receipts: ${error}`}</div>;
  }

  return (
    <div>
      {receipts.map((doc) => {
        return <ReceiptRow doc={doc} key={doc.id} />;
      })}
    </div>
  );
};
