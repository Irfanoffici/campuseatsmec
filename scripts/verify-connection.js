
// Script to verify database connectivity
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } = require('firebase/firestore');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        process.env[match[1]] = match[2].trim();
    }
});

console.log('Environment variables loaded.');

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log('Initializing Firebase with project ID:', firebaseConfig.projectId);

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function verifyConnection() {
        console.log('Testing Firestore connection...');

        try {
            // Test 1: Write a temporary document to 'vendors' (open for read, but restricted for write usually... 
            // wait, my rules say "Everyone can read vendors", "Only admins can create vendors".
            // So I can't write to vendors without auth.

            // Let's try to READ from vendors. Even if empty, it should succeed.
            const vendorsRef = collection(db, 'vendors');
            const snapshot = await getDocs(vendorsRef);
            console.log('✅ Successfully connected to Firestore!');
            console.log(`Found ${snapshot.docs.length} vendors.`);

            // If we want to test write, we need to be authenticated or use a collection that allows open write.
            // My rules don't allow open write.
            // So this read test confirms connectivity and rules (if it failed with "Missing or insufficient permissions", 
            // that would also confirm connection but deny access. If it works, it confirms access).

            console.log('Database integration verified.');
            process.exit(0);
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
            if (error.code) console.error('Error code:', error.code);
            process.exit(1);
        }
    }

    verifyConnection();

} catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
}
