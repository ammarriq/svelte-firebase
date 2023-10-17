import admin from 'firebase-admin'
import { FIREBASE_SERVER_CONFIG } from '$env/static/private'

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(FIREBASE_SERVER_CONFIG))
	})
}

export const db = admin.firestore()
