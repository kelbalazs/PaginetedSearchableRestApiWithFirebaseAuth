import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBop4RugAPUse4OUr7XeNpoEZXf-DPu6xo",
  authDomain: "vue-firebase1-ce4d6.firebaseapp.com",
  projectId: "vue-firebase1-ce4d6",
  storageBucket: "vue-firebase1-ce4d6.appspot.com",
  messagingSenderId: "581249347005",
  appId: "1:581249347005:web:12bc1f26defd0ad5bd76d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
