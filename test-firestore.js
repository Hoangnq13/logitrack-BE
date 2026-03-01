require('dotenv').config();
const admin = require('firebase-admin');

const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

async function testFirestore() {
    const db = admin.firestore();
    console.log("Testing Firestore connection...");
    try {
        const docRef = db.collection('test_connection').doc('test_doc');
        await docRef.set({
            message: 'Hello from Node!',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("Successfully wrote to Firestore");
    } catch (error) {
        console.error("Firestore Error:", error);
    }
}

testFirestore();
