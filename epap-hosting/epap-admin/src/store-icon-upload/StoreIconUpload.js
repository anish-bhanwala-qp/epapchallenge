import React from "react";
import firebase from "firebase/app";
import { StoreDropdown } from "./StoreDropdown";
import styles from "./StoreIconUpload.module.css";
import { db } from "../firebaseConfig";
import { UploadStoreIconService } from "./UploadStoreIconService";

export class StoreIconUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      store: "-1",
    };
    this.fileInput = React.createRef(null);
  }

  resetForm = () => {
    this.setState({ store: "-1" });
    this.fileInput.current.value = "";
  };

  handleStoreChange = (store) => {
    this.setState({ store });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.store == null || this.state.store === "-1") {
      alert("Please select a store.");
    } else if (
      !this.fileInput.current.files ||
      this.fileInput.current.files.length === 0
    ) {
      alert("Please select an image file to upload.");
    } else {
      this.handleUpload();
    }
  };

  setStatus = (status) => {
    this.setState({ status });
  };

  handleUpload = () => {
    const { store } = this.state;
    const file = this.fileInput.current.files[0];
    new UploadStoreIconService(store, file, this.setStatus)
      .upload()
      .finally(this.resetForm);
  };

  render() {
    const { status, store } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        {status && <div className={styles.row}>{"status: " + status}</div>}
        <div className={styles.row}>
          <label>
            Select Store:
            <StoreDropdown
              value={store && store.id}
              handleChange={this.handleStoreChange}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Select file:
            <input type="file" accept="image/*" ref={this.fileInput} />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            <input type="submit" value="Submit" />
          </label>
        </div>
      </form>
    );
  }
}
