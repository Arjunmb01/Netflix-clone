import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCu3fpdjy4H_ijuqGdKoflQmNcVcPfBplM",
  authDomain: "netflix-73329.firebaseapp.com",
  projectId: "netflix-73329",
  storageBucket: "netflix-73329.firebasestorage.app",
  messagingSenderId: "584095699164",
  appId: "1:584095699164:web:ac5e3f52d4f9926c3fa419"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    toast.success("Account created successfully!");
  } catch (error: any) {
    console.error("Signup error:", error);
  }
};

const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!");
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage =
      error.code?.split("/")[1]?.split("-")?.join(" ") || "Login failed";
    toast.error(errorMessage);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error: any) {
    console.error("Logout error:", error);
    toast.error("Logout failed");
    throw error;
  }
};

export { auth, db, login, signUp, logout };