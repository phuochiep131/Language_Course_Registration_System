// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQhdJnoXuxOCgWNwewIXGB58rCZYGKi3U",
  authDomain: "languagecourseregistration.firebaseapp.com",
  databaseURL: "https://languagecourseregistration-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "languagecourseregistration",
  storageBucket: "languagecourseregistration.appspot.com",
  messagingSenderId: "405569363914",
  appId: "1:405569363914:web:58be0cca7bef80474d3933",
  measurementId: "G-DQ33X3DHR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
