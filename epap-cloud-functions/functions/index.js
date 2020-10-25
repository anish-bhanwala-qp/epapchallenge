const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.onStoreImageUpload = functions.storage
  .object("images/store")
  .onFinalize(async (object, context) => {
    const storeName = object.metadata.storeName;
    const storeId = object.metadata.storeId;    
    console.log(`File uploaded in store: ${storeName}, ${storeId}`);

    
    admin.storage().

    db.collection(`stores/${storeId}`).set({
        iconUrl: object.get
    })
  });

// On sign up.
exports.processSignUp = functions.auth.user().onCreate((user) => {
  // Check if user meets role criteria.
  if (
    user.email &&
    (user.email.endsWith("@epap.app") ||
      user.email === "anishbhanwala@gmail.com") &&
    user.emailVerified
  ) {
    const customClaims = {
      admin: true,
    };
    // Set custom user claims on this newly created user.
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        console.log(`Admin access granted to : ${user.email}`);
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: new Date().getTime() });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
