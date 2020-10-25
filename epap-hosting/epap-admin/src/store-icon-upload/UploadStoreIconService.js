import firebase from "firebase/app";
import { db } from "../firebaseConfig";

export class UploadStoreIconService {
  constructor(store, file, statusCallback) {
    this.store = store;
    this.file = file;
    this.statusCallback = statusCallback;
  }

  upload = () => {
    const { store, file, statusCallback } = this;

    statusCallback("File upload started...");
    // Create a root reference
    const storageRef = firebase.storage().ref();
    const metadata = {
      customMetadata: {
        storeId: store.id,
        storeName: store.get("name"),
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
          this.syncIconUrlInStoreAndReceipts(uploadTask, resolve, reject);
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

  syncIconUrlInStoreAndReceipts = async (uploadTask, resolve, reject) => {
    try {
      this.statusCallback(`File uploaded.`);
      const iconUrl = await uploadTask.snapshot.ref.getDownloadURL();

      this.updateStoreIconUrl(iconUrl);
      this.statusCallback(`Updated store icon.`);

      this.updateReceiptsStoreImageUrl(iconUrl);

      this.statusCallback(`Success! Download URL: ${iconUrl}.`);

      resolve();
    } catch (e) {
      reject();
      this.statusCallback(`Oops an error occured: ${e.message}`);
    }
  };

  updateStoreIconUrl = async (iconUrl) => {
    await this.store.ref.set(
      {
        iconUrl,
      },
      { merge: true }
    );
  };

  updateReceiptsStoreImageUrl = async (iconUrl) => {
    try {
      const receipts = await db
        .collection("receipts")
        .where("storeId", "==", this.store.ref)
        .get();

      const batch = db.batch();

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
