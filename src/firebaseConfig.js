import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBt55S8j6SJH98vXqPARvAfIO_VlU8dW9M",
  authDomain: "embeddedproj-eccc2.firebaseapp.com",
  databaseURL: "https://embeddedproj-eccc2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embeddedproj-eccc2",
  storageBucket: "embeddedproj-eccc2.firebasestorage.app",
  messagingSenderId: "746785243044",
  appId: "1:746785243044:web:de1afe8fba410092cecb31",
  measurementId: "G-H47M17P4GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

