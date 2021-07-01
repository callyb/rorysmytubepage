const functions = require('firebase-functions');
const admin = require('firebase-admin');

// copy the document
exports.moveRecord = functions.firestore
    .document('users/{uid}')
    .onUpdate(async (change, context) => {
        const previousValue = change.before.data();
        const newValue = change.after.data();
        const uid = previousValue.uid;

        // define the delete function
        const deleteDoc = async => {
            const docRef = admin.firestore().doc('users/{userID}');
            try {
                return docRef.delete()
                    .then(() => true)
            }

            catch (e) {
                console.error('Error deleting document', JSON.stringify(e));
                return false;
            }
        }

        if (newValue.mistake) {
            // document exists, create the new item
            await admin
                .firestore()
                .collection('mistakes')
                .doc(previousValue.uid)
                .set({ ...previousValue })
                .catch((error) => {
                    console.error('Error creating document', JSON.stringify(error));

                });
            // run the delete function
            deleteDoc();
        }
        return false;
    });
