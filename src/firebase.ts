import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_ETK0JhcfUCgZ_6GXyazNFA_sD_o-xYM",
  authDomain: "portfolio-alfonsocperez.firebaseapp.com",
  projectId: "portfolio-alfonsocperez",
  storageBucket: "portfolio-alfonsocperez.firebasestorage.app",
  messagingSenderId: "845396733094",
  appId: "1:845396733094:web:eb9983b2dc01fa191d1867",
  measurementId: "G-9V43JSDJYD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
export default app;