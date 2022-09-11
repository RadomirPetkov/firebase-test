import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./.private";
import { getStorage } from "firebase/storage"

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)