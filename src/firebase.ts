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
    try {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (dbError: any) {
      console.error("Database error (user still created):", dbError);
      // User is created even if database write fails, so we continue
    }
    toast.success("Account created successfully!");
  } catch (error: any) {
    console.error("Signup error:", error);
    let errorMessage = "Signup failed";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already in use";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code) {
      errorMessage = error.code.split("/")[1]?.split("-")?.join(" ") || "Signup failed";
    }
    toast.error(errorMessage);
    throw error;
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