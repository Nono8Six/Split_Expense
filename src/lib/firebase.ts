import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "split-expense-couple.firebaseapp.com",
    projectId: "split-expense-couple",
    storageBucket: "split-expense-couple.firebasestorage.app",
    messagingSenderId: "852261675102",
    appId: "1:852261675102:web:cc99ed8eaaeaec916714cf",
    measurementId: "G-R243JQZZS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
