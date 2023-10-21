import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase
const app = initializeApp(JSON.parse(PUBLIC_FIREBASE_CONFIG))
export const db = getFirestore(app)
