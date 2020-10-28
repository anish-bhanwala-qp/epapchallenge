import firebase from "firebase/app";
import { firestoreDb, realtimeDb } from "../firebaseConfig";

export class UploadStoreIconService {
  constructor(storeName, file, statusCallback) {
    this.storeName = storeName;
    this.file = file;
    this.statusCallback = statusCallback;
  }

  upload = () => {
    const { storeName, file, statusCallback } = this;

    statusCallback("File upload started...");
    // Create a root reference
    const storageRef = firebase.storage().ref();

    const metadata = {
      customMetadata: {
        storeName,
      },
    };
    const uploadTask = storageRef
      .child(`/images/store/${file.name}`)
      .put(file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        this.updateProgress,
        (error) => {
          statusCallback(`Oops error occured (${error.message}`);
          reject();
        },
        () => {
          statusCallback("File uploaded. Updating store database...");
          this.syncIconUrlInStoreAndReceipts(
            uploadTask,
            storeName,
            resolve,
            reject
          );
        }
      );
    });
  };

  updateProgress = (snapshot) => {
    const progress = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    this.statusCallback("Upload is " + progress + "% done.");
  };

  syncIconUrlInStoreAndReceipts = async (
    uploadTask,
    storeName,
    resolve,
    reject
  ) => {
    try {
      this.statusCallback(`File uploaded.`);
      const iconUrl = await uploadTask.snapshot.ref.getDownloadURL();
      const iconRef = realtimeDb.ref(`storeIcons`);
      const data = {};
      data[`${storeName}`] = iconUrl;
      iconRef
        .update(data)
        .catch((err) => console.log("store icon update failed", err));

      // this.updateStoreIconUrl(iconUrl);
      // this.statusCallback(`Updated store icon.`);
      // this.updateReceiptsStoreImageUrl(iconUrl);

      this.statusCallback(`Success! Download URL: ${iconUrl}.`);

      resolve();
    } catch (e) {
      reject();
      this.statusCallback(`Oops an error occured: ${e.message}`);
    }
  };

  updateStoreIconUrl = async (iconUrl) => {
    await this.storeName.ref.set(
      {
        iconUrl,
      },
      { merge: true }
    );
  };

  updateReceiptsStoreImageUrl = async (iconUrl) => {
    try {
      const receipts = await firestoreDb
        .collection("receipts")
        .where("storeId", "==", this.storeName.ref)
        .get();

      const batch = firestoreDb.batch();

      receipts.docs.forEach((doc) => {
        batch.update(doc.ref, { storeIconUrl: iconUrl });
      });

      await batch.commit();
      this.statusCallback("Synced icon url in receipts");
    } catch (e) {
      this.statusCallback(`Error updating receipts: ${e.message}`);
    }
  };
}
