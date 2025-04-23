import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";  // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCQhdJnoXuxOCgWNwewIXGB58rCZYGKi3U",
  authDomain: "languagecourseregistration.firebaseapp.com",
  projectId: "languagecourseregistration",
  storageBucket: "languagecourseregistration.firebasestorage.app",
  messagingSenderId: "405569363914",
  appId: "1:405569363914:web:58be0cca7bef80474d3933",
  measurementId: "G-DQ33X3DHR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 

export { storage };
