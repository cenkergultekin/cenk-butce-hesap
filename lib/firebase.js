import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase konfigürasyonu - Firebase Console'dan alınan değerler
const firebaseConfig = {
  apiKey: "AIzaSyA0mGabZMVvb4PW8b38NYcPj8KWPI1LNCU",
  authDomain: "expensetracker-71ceb.firebaseapp.com",
  projectId: "expensetracker-71ceb",
  storageBucket: "expensetracker-71ceb.firebasestorage.app",
  messagingSenderId: "496174470664",
  appId: "1:496174470664:web:2991d314e9065ebb9163bd"
}

// Firebase'i initialize et
const app = initializeApp(firebaseConfig)

// Firestore database referansını export et
export const db = getFirestore(app)
export default app 