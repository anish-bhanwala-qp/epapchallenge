import React from "react";
import { ReceiptRow } from "./ReceiptRow";
import { firestoreDb, realtimeDb } from "../firebaseConfig";

export class ReceiptList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receipts: [],
      storeIcons: {},
      error: "",
    };

    this.unsubscribeReceipts = () => {};
    this.storeIconRef = realtimeDb.ref("storeIcons");
  }

  componentDidMount() {
    this.unsubscribeReceipts = firestoreDb.collection("receipts").onSnapshot(
      (querySnapshot) => {
        console.log("Query snapshot called");
        const rs = [];
        querySnapshot.forEach(function (doc) {
          rs.push(doc);
        });

        this.setState({ receipts: rs });
      },
      (e) => {
        this.setState({ error: e.message });
      }
    );

    this.storeIconRef.once("value", (snapshot) => {
      console.log("storeIcons received", snapshot.val());
      this.setState({ storeIcons: snapshot.val() });
    });

    const addNewStoreIcon = (snapshot) => {
      console.log("Store icon added", snapshot.val(), snapshot.key);
      const newStoreIcon = {};
      newStoreIcon[snapshot.key] = snapshot.val();
      this.setState({
        storeIcons: {
          ...this.state.storeIcons,
          [snapshot.key]: snapshot.val(),
        },
      });
    };
    this.storeIconRef.on("child_changed", addNewStoreIcon);
  }

  componentWillUnmount() {
    this.storeIconRef.off();
    this.unsubscribeReceipts();
  }

  render() {
    const { storeIcons, receipts, error } = this.state;
    if (error) {
      return <div>{`Error fetching receipts: ${error}`}</div>;
    }

    return (
      <div>
        {receipts.map((doc) => {
          return (
            <ReceiptRow
              storeIconUrl={storeIcons[doc.data().storeName]}
              doc={doc}
              key={doc.id}
            />
          );
        })}
      </div>
    );
  }
}
